import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Fetch all products for this vendor
    const products = await prisma.listing.findMany({
      where: {
        vendorId: user.vendor.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      products
    })

  } catch (error) {
    console.error('Fetch vendor products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    )
  }
}
