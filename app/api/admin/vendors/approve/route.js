import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and verify admin role
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { vendorId } = await request.json();

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    // Get vendor with user details
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (vendor.status !== "PENDING") {
      return NextResponse.json(
        { error: "Vendor has already been processed" },
        { status: 400 }
      );
    }

    // Update vendor status to APPROVED
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        rejectionReason: null, // Clear any previous rejection reason
      },
    });

    // Create notification for vendor
    await prisma.notification.create({
      data: {
        userId: vendor.user.id,
        type: "VENDOR_APPROVED",
        title: "Vendor Application Approved! 🎉",
        message: `Congratulations ${vendor.user.displayName}! Your vendor application for "${vendor.businessName}" has been approved. You can now start selling on TradeFair.`,
        metadata: {
          vendorId: vendor.id,
          businessName: vendor.businessName,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vendor approved successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error approving vendor:", error);
    return NextResponse.json(
      { error: "Failed to approve vendor" },
      { status: 500 }
    );
  }
}
