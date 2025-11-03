import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { listingId } = await params;

    // Get query parameters for pagination and sorting
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "recent"; // recent, helpful, rating
    const skip = (page - 1) * limit;

    // Build orderBy clause
    let orderBy;
    switch (sortBy) {
      case "helpful":
        orderBy = { helpfulCount: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Fetch reviews
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { listingId },
        include: {
          user: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              helpfulVotes: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { listingId },
      }),
    ]);

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: { listingId },
      _count: {
        rating: true,
      },
    });

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: { listingId },
      _avg: {
        rating: true,
      },
    });

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        averageRating: avgRating._avg.rating || 0,
        totalReviews: totalCount,
        ratingDistribution: ratingDistribution.reduce((acc, item) => {
          acc[item.rating] = item._count.rating;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { orderId, rating, comment, images } = await request.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId: user.id,
        status: "DELIVERED",
        items: {
          some: {
            listingId,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "You can only review products from delivered orders" },
        { status: 403 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        listingId,
        userId: user.id,
        orderId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        listingId,
        userId: user.id,
        orderId,
        rating,
        comment: comment.trim(),
        images: images || [],
        isVerifiedPurchase: true,
      },
      include: {
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update listing average rating
    const avgRating = await prisma.review.aggregate({
      where: { listingId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        averageRating: avgRating._avg.rating || 0,
        reviewCount: avgRating._count.rating,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
