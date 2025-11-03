import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and verify admin role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch pending vendors with user details
    const pendingVendors = await prisma.vendor.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            displayName: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Oldest first
      },
    });

    return NextResponse.json({
      success: true,
      vendors: pendingVendors,
    });
  } catch (error) {
    console.error("Error fetching pending vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending vendors" },
      { status: 500 }
    );
  }
}
