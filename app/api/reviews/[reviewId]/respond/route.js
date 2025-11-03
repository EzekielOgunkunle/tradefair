import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Vendor response to review
export async function POST(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId } = await params;
    const { response } = await request.json();

    if (!response || response.trim().length === 0) {
      return NextResponse.json(
        { error: "Response is required" },
        { status: 400 }
      );
    }

    // Get user with vendor info
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        vendor: {
          select: { id: true },
        },
      },
    });

    if (!user || !user.vendor) {
      return NextResponse.json(
        { error: "Only vendors can respond to reviews" },
        { status: 403 }
      );
    }

    // Get review and verify it's for vendor's product
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        listing: {
          select: { vendorId: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.listing.vendorId !== user.vendor.id) {
      return NextResponse.json(
        { error: "You can only respond to reviews of your products" },
        { status: 403 }
      );
    }

    // Update review with vendor response
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        vendorResponse: response.trim(),
        vendorRespondedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Response submitted successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error submitting vendor response:", error);
    return NextResponse.json(
      { error: "Failed to submit response" },
      { status: 500 }
    );
  }
}
