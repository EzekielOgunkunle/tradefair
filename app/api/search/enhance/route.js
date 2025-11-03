import { NextResponse } from 'next/server';
import { enhanceSearchQuery } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query is required',
        },
        { status: 400 }
      );
    }

    // Get AI enhancement
    const enhanced = await enhanceSearchQuery(query);

    // Build optimized search filters
    const filters = {
      keywords: enhanced.keywords,
      category: enhanced.category,
      priceIntent: enhanced.priceIntent,
      attributes: enhanced.attributes,
    };

    // Get suggested price range based on intent
    let suggestedPriceRange = null;
    if (enhanced.priceIntent === 'budget') {
      suggestedPriceRange = { min: 0, max: 10000 };
    } else if (enhanced.priceIntent === 'mid-range') {
      suggestedPriceRange = { min: 10000, max: 50000 };
    } else if (enhanced.priceIntent === 'premium') {
      suggestedPriceRange = { min: 50000, max: null };
    }

    // Get suggested category from database if AI suggested one
    let categoryExists = false;
    if (enhanced.category) {
      const categoryCheck = await prisma.listing.findFirst({
        where: {
          categories: { has: enhanced.category },
          isActive: true,
        },
      });
      categoryExists = !!categoryCheck;
    }

    return NextResponse.json({
      success: true,
      enhanced: {
        ...filters,
        suggestedPriceRange,
        categoryExists,
      },
      original: query,
    });
  } catch (error) {
    console.error('Error enhancing search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to enhance search',
      },
      { status: 500 }
    );
  }
}
