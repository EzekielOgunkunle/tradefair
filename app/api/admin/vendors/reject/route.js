import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendVendorApprovalEmail } from "@/lib/email";

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

    const { vendorId, reason } = await request.json();

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
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

    // Update vendor status to REJECTED
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });

    // Create notification for vendor
    await prisma.notification.create({
      data: {
        userId: vendor.user.id,
        type: "VENDOR_REJECTED",
        title: "Vendor Application Update",
        message: `Unfortunately, your vendor application for "${vendor.businessName}" has not been approved at this time. Reason: ${reason}. You can contact support for more information or reapply after addressing the concerns.`,
        metadata: {
          vendorId: vendor.id,
          businessName: vendor.businessName,
          rejectionReason: reason,
        },
      },
    });

    // Send rejection email
    try {
      await sendVendorApprovalEmail(updatedVendor, vendor.user, false);
    } catch (emailError) {
      console.error('Failed to send vendor rejection email:', emailError);
      // Don't fail the rejection if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Vendor rejected successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    return NextResponse.json(
      { error: "Failed to reject vendor" },
      { status: 500 }
    );
  }
}
