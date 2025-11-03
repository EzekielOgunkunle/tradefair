import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendOrderStatusEmail, sendNewOrderNotificationToVendor } from '@/lib/email'

export async function POST(request) {
  try {
    const { reference, status } = await request.json()

    if (!reference || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find all orders with this reference
    const orders = await prisma.order.findMany({
      where: {
        paystackReference: reference
      }
    })

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update all orders with the new status
    await prisma.order.updateMany({
      where: {
        paystackReference: reference
      },
      data: {
        status: status,
        updatedAt: new Date()
      }
    })

    // If payment is successful, create platform revenue records
    if (status === 'PAID') {
      for (const order of orders) {
        const commissionRate = 0.05 // 5% platform fee
        const platformFeeCents = Math.round(order.totalAmountCents * commissionRate)
        const vendorAmountCents = order.totalAmountCents - platformFeeCents

        await prisma.platformRevenue.create({
          data: {
            orderId: order.id,
            vendorId: order.vendorId,
            totalAmountCents: order.totalAmountCents,
            platformFeeCents,
            vendorAmountCents,
            commissionRate,
            currency: order.currency,
            paystackReference: reference
          }
        })

        // Get full order details with relations for emails
        const fullOrder = await prisma.order.findUnique({
          where: { id: order.id },
          include: {
            buyer: true,
            items: {
              include: {
                listing: true
              }
            },
            shippingAddress: true
          }
        })

        // Create notification for buyer
        const buyerUser = await prisma.user.findUnique({
          where: { id: order.buyerId }
        })

        if (buyerUser) {
          await prisma.notification.create({
            data: {
              userId: buyerUser.id,
              type: 'order_confirmed',
              title: 'Order Confirmed',
              message: `Your order has been confirmed and is being processed.`,
              metadata: {
                orderId: order.id,
                reference
              }
            }
          })

          // Send order confirmation email
          try {
            await sendOrderConfirmationEmail(fullOrder, buyerUser)
          } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError)
            // Don't fail the order if email fails
          }
        }

        // Create notification for vendor
        const vendor = await prisma.vendor.findUnique({
          where: { id: order.vendorId },
          include: { user: true }
        })

        if (vendor?.user) {
          await prisma.notification.create({
            data: {
              userId: vendor.user.id,
              type: 'new_order',
              title: 'New Order Received',
              message: `You have received a new order worth ₦${(vendorAmountCents / 100).toLocaleString()}`,
              metadata: {
                orderId: order.id,
                reference
              }
            }
          })

          // Send new order email to vendor
          try {
            await sendNewOrderNotificationToVendor(fullOrder, vendor, vendor.user)
          } catch (emailError) {
            console.error('Failed to send vendor notification email:', emailError)
            // Don't fail the order if email fails
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      updatedOrders: orders.length
    })

  } catch (error) {
    console.error('Order status update error:', error)
    return NextResponse.json(
      { error: 'Failed to update order status', details: error.message },
      { status: 500 }
    )
  }
}
