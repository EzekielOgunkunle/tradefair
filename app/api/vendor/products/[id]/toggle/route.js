import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const { isActive } = await request.json()

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      )
    }

    // Get user and verify they are a vendor
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { vendor: true }
    })

    if (!user || !user.vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Verify product belongs to this vendor
    const product = await prisma.listing.findFirst({
      where: {
        id,
        vendorId: user.vendor.id
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product status
    const updatedProduct = await prisma.listing.update({
      where: { id },
      data: { isActive }
    })

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: `Product ${isActive ? 'activated' : 'deactivated'} successfully`
    })

  } catch (error) {
    console.error('Toggle product status error:', error)
    return NextResponse.json(
      { error: 'Failed to update product status', details: error.message },
      { status: 500 }
    )
  }
}
