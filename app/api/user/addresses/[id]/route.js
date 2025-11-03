import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const {
      label,
      fullName,
      phoneNumber,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = await request.json();

    // Verify address belongs to user
    const address = await prisma.savedAddress.findUnique({
      where: { id },
    });

    if (!address || address.userId !== user.id) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.savedAddress.updateMany({
        where: { userId: user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    // Update address
    const updatedAddress = await prisma.savedAddress.update({
      where: { id },
      data: {
        label,
        fullName,
        phoneNumber,
        street,
        city,
        state,
        postalCode,
        country,
        isDefault,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify address belongs to user
    const address = await prisma.savedAddress.findUnique({
      where: { id },
    });

    if (!address || address.userId !== user.id) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // Delete address
    await prisma.savedAddress.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
