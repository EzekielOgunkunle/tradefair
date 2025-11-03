import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Mark review as helpful
export async function POST(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already marked as helpful
    const existing = await prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id,
        },
      },
    });

    if (existing) {
      // Remove helpful vote
      await prisma.reviewHelpful.delete({
        where: { id: existing.id },
      });

      // Decrement helpful count
      const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
          helpfulCount: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Removed helpful vote",
        helpfulCount: review.helpfulCount,
        isHelpful: false,
      });
    } else {
      // Add helpful vote
      await prisma.reviewHelpful.create({
        data: {
          reviewId,
          userId: user.id,
        },
      });

      // Increment helpful count
      const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Marked as helpful",
        helpfulCount: review.helpfulCount,
        isHelpful: true,
      });
    }
  } catch (error) {
    console.error("Error toggling helpful vote:", error);
    return NextResponse.json(
      { error: "Failed to update helpful vote" },
      { status: 500 }
    );
  }
}
