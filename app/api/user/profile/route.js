import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile with relations
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
            savedAddresses: true,
            notifications: { where: { isRead: false } },
          },
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
            status: true,
            rating: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get recent orders summary
    const recentOrders = await prisma.order.findMany({
      where: { buyerId: user.id },
      select: {
        id: true,
        status: true,
        totalAmountCents: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Calculate total spent
    const totalSpent = await prisma.order.aggregate({
      where: {
        buyerId: user.id,
        status: {
          in: ["DELIVERED", "SHIPPED", "PROCESSING", "PAID"],
        },
      },
      _sum: {
        totalAmountCents: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        stats: {
          totalOrders: user._count.orders,
          totalReviews: user._count.reviews,
          savedAddresses: user._count.savedAddresses,
          unreadNotifications: user._count.notifications,
          totalSpent: totalSpent._sum.totalAmountCents || 0,
        },
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName } = await request.json();

    if (!displayName || displayName.trim().length === 0) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      );
    }

    // Update user
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: { displayName: displayName.trim() },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
