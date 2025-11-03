import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      // Allow anonymous tracking for browsing, but don't save
      return NextResponse.json({ success: true, tracked: false });
    }

    const { listingId, activityType, metadata } = await request.json();

    // Validate activity type
    const validTypes = ['VIEW_PRODUCT', 'ADD_TO_CART', 'SEARCH', 'VIEW_CATEGORY', 'PURCHASE'];
    if (!validTypes.includes(activityType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid activity type',
        },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Create activity record
    const activity = await prisma.userActivity.create({
      data: {
        userId: user.id,
        listingId: listingId || null,
        activityType,
        metadata: metadata || {},
      },
    });

    return NextResponse.json({
      success: true,
      tracked: true,
      activityId: activity.id,
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track activity',
      },
      { status: 500 }
    );
  }
}
