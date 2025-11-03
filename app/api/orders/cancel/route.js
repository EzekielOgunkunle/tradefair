import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId, reason } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId: user.id
      },
      include: {
        items: {
          include: {
            listing: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order can be cancelled
    if (!['PENDING', 'PAID', 'PROCESSING'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Order cannot be cancelled at this stage' },
        { status: 400 }
      )
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason
      }
    })

    // Restore inventory
    for (const item of order.items) {
      await prisma.listing.update({
        where: { id: item.listingId },
        data: {
          inventory: {
            increment: item.quantity
          }
        }
      })
    }

    // Create notification for vendor
    await prisma.notification.create({
      data: {
        userId: order.vendorId,
        title: 'Order Cancelled',
        message: `Order #${order.id.substring(0, 8)} has been cancelled by the buyer.${reason ? ` Reason: ${reason}` : ''}`,
        type: 'ORDER_UPDATE'
      }
    })

    // Create notification for buyer
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Order Cancelled',
        message: `Your order #${order.id.substring(0, 8)} has been successfully cancelled.`,
        type: 'ORDER_UPDATE'
      }
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Order cancelled successfully'
    })

  } catch (error) {
    console.error('Cancel order error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order', details: error.message },
      { status: 500 }
    )
  }
}
