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
    const { status, trackingNumber } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
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

    // Verify order belongs to this vendor
    const order = await prisma.order.findFirst({
      where: {
        id,
        vendorId: user.vendor.id
      },
      include: {
        buyer: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status
    const updateData = {
      status,
      updatedAt: new Date()
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData
    })

    // Create notification for buyer
    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        title: `Order Status Updated`,
        message: `Your order #${order.id.substring(0, 8)} status has been updated to ${status}.${trackingNumber ? ` Tracking number: ${trackingNumber}` : ''}`,
        type: 'ORDER_UPDATE'
      }
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Order status updated successfully'
    })

  } catch (error) {
    console.error('Update order status error:', error)
    return NextResponse.json(
      { error: 'Failed to update order status', details: error.message },
      { status: 500 }
    )
  }
}
