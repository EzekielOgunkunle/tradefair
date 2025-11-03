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

    // Fetch all orders for this vendor
    const orders = await prisma.order.findMany({
      where: {
        vendorId: user.vendor.id
      },
      include: {
        buyer: {
          select: {
            displayName: true,
            email: true
          }
        },
        items: {
          include: {
            listing: {
              select: {
                title: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      orders
    })

  } catch (error) {
    console.error('Fetch vendor orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    )
  }
}
