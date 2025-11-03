import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateProductRecommendations } from '@/lib/gemini';

export async function GET(request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 10;

    // Get all active products for recommendations
    const products = await prisma.listing.findMany({
      where: {
        isActive: true,
        stockQuantity: { gt: 0 },
      },
      take: 50, // Get top 50 products to recommend from
      orderBy: [
        { averageRating: 'desc' },
        { reviewCount: 'desc' },
      ],
      include: {
        vendor: {
          include: {
            user: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
    });

    let recommendations = [];

    if (userId) {
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      });

      if (user) {
        // Get user's recent activities (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentActivities = await prisma.userActivity.findMany({
          where: {
            userId: user.id,
            createdAt: { gte: thirtyDaysAgo },
          },
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                categories: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 100,
        });

        // Get user's purchase history
        const orders = await prisma.order.findMany({
          where: {
            buyerId: user.id,
            status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING'] },
          },
          include: {
            items: {
              include: {
                listing: {
                  select: {
                    categories: true,
                  },
                },
              },
            },
          },
          take: 10,
        });

        // Extract user context for AI
        const recentSearches = recentActivities
          .filter((a) => a.activityType === 'SEARCH' && a.metadata?.searchTerm)
          .map((a) => a.metadata.searchTerm)
          .slice(0, 5);

        const viewedCategories = [
          ...new Set(
            recentActivities
              .filter((a) => a.listing?.categories)
              .flatMap((a) => a.listing.categories)
          ),
        ].slice(0, 5);

        const purchaseCategories = [
          ...new Set(
            orders
              .flatMap((o) => o.items)
              .filter((item) => item.listing?.categories)
              .flatMap((item) => item.listing.categories)
          ),
        ].slice(0, 5);

        const userContext = {
          recentSearches,
          viewedCategories,
          purchaseCategories,
        };

        // Use AI to generate personalized recommendations
        recommendations = await generateProductRecommendations(
          userContext,
          products
        );
      }
    }

    // If no personalized recommendations or user not logged in, use default logic
    if (recommendations.length === 0) {
      // Default: recommend top-rated products
      recommendations = products.slice(0, limit);
    }

    // Limit results
    recommendations = recommendations.slice(0, limit);

    return NextResponse.json({
      success: true,
      recommendations,
      personalized: userId && recommendations.length > 0,
      count: recommendations.length,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    // Fallback: return some products even on error
    try {
      const fallbackProducts = await prisma.listing.findMany({
        where: {
          isActive: true,
          stockQuantity: { gt: 0 },
        },
        take: 10,
        orderBy: {
          averageRating: 'desc',
        },
        include: {
          vendor: {
            include: {
              user: {
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        recommendations: fallbackProducts,
        personalized: false,
        count: fallbackProducts.length,
        fallback: true,
      });
    } catch (fallbackError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate recommendations',
        },
        { status: 500 }
      );
    }
  }
}
