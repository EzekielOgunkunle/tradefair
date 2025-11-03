import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSearchSuggestions } from '@/lib/gemini';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: [],
      });
    }

    // Get some products for context
    const products = await prisma.listing.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
      select: {
        id: true,
        title: true,
        categories: true,
      },
    });

    // Generate AI-powered suggestions
    const aiSuggestions = await generateSearchSuggestions(query, products);

    // Get exact database matches for instant suggestions
    const dbSuggestions = products
      .map(p => p.title)
      .filter(title => title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3);

    // Combine and deduplicate
    const allSuggestions = [...new Set([...dbSuggestions, ...aiSuggestions])];

    return NextResponse.json({
      success: true,
      suggestions: allSuggestions.slice(0, 8),
      query,
    });
  } catch (error) {
    console.error('Error in search suggestions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate suggestions',
      },
      { status: 500 }
    );
  }
}
