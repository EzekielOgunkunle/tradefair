import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

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

    // Fetch product and verify it belongs to this vendor
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

    return NextResponse.json({
      success: true,
      product
    })

  } catch (error) {
    console.error('Fetch product details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error.message },
      { status: 500 }
    )
  }
}
