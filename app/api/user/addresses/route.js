import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get saved addresses
    const addresses = await prisma.savedAddress.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Validate required fields
    if (
      !label ||
      !fullName ||
      !phoneNumber ||
      !street ||
      !city ||
      !state ||
      !postalCode
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.savedAddress.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create address
    const address = await prisma.savedAddress.create({
      data: {
        userId: user.id,
        label,
        fullName,
        phoneNumber,
        street,
        city,
        state,
        postalCode,
        country: country || "Nigeria",
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address saved successfully",
      address,
    });
  } catch (error) {
    console.error("Error saving address:", error);
    return NextResponse.json(
      { error: "Failed to save address" },
      { status: 500 }
    );
  }
}
