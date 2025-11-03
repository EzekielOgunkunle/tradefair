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

    const { orderId, reason, bankDetails } = await request.json()

    if (!orderId || !reason) {
      return NextResponse.json(
        { error: 'Order ID and reason are required' },
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
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if refund can be requested
    if (!['PAID', 'PROCESSING', 'SHIPPED'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Refund cannot be requested for this order' },
        { status: 400 }
      )
    }

    // Check if refund already requested
    const existingRequest = await prisma.refundRequest.findFirst({
      where: {
        orderId,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Refund request already exists for this order' },
        { status: 400 }
      )
    }

    // Create refund request
    const refundRequest = await prisma.refundRequest.create({
      data: {
        orderId,
        userId: user.id,
        reason,
        amount: order.totalAmountCents,
        bankDetails: bankDetails ? JSON.stringify(bankDetails) : null,
        status: 'PENDING'
      }
    })

    // Create notification for vendor
    await prisma.notification.create({
      data: {
        userId: order.vendorId,
        title: 'Refund Request',
        message: `A refund request has been submitted for order #${order.id.substring(0, 8)}. Amount: ₦${(order.totalAmountCents / 100).toLocaleString()}`,
        type: 'REFUND_REQUEST'
      }
    })

    // Create notification for buyer
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Refund Request Submitted',
        message: `Your refund request for order #${order.id.substring(0, 8)} has been submitted and is under review.`,
        type: 'REFUND_REQUEST'
      }
    })

    return NextResponse.json({
      success: true,
      refundRequest,
      message: 'Refund request submitted successfully'
    })

  } catch (error) {
    console.error('Request refund error:', error)
    return NextResponse.json(
      { error: 'Failed to request refund', details: error.message },
      { status: 500 }
    )
  }
}
