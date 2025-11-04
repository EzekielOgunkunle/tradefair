import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
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

    const { items, shippingAddress, totalAmountCents, subtotalCents, deliveryFeeCents } = await request.json()

    // Validate request
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      )
    }

    // Get user from database or create if doesn't exist
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      // Fallback: Create user if not found (webhook might have failed)
      const clerkUser = await currentUser()
      
      if (!clerkUser) {
        return NextResponse.json(
          { error: 'User authentication failed' },
          { status: 401 }
        )
      }

      const displayName = clerkUser.firstName && clerkUser.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] || 'User'

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          displayName,
          role: 'BUYER',
        },
      })

      console.log('User created during order creation:', userId)
    }

    // Group items by vendor
    const itemsByVendor = {}
    for (const item of items) {
      // Fetch listing to get vendor
      const listing = await prisma.listing.findUnique({
        where: { id: item.id },
        include: { vendor: true }
      })

      if (!listing) {
        return NextResponse.json(
          { error: `Product not found: ${item.name || item.id}. Please remove it from your cart and try again.` },
          { status: 404 }
        )
      }

      // Check inventory
      if (listing.inventory < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${listing.title}. Only ${listing.inventory} available.` },
          { status: 400 }
        )
      }

      const vendorId = listing.vendorId
      if (!itemsByVendor[vendorId]) {
        itemsByVendor[vendorId] = []
      }
      itemsByVendor[vendorId].push({
        ...item,
        listing
      })
    }

    // Create orders for each vendor
    const orders = []
    const reference = `TF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    for (const [vendorId, vendorItems] of Object.entries(itemsByVendor)) {
      const vendorTotal = vendorItems.reduce((sum, item) => 
        sum + (item.listing.priceCents * item.quantity), 0
      )

      // Create order
      const order = await prisma.order.create({
        data: {
          buyerId: user.id,
          vendorId,
          totalAmountCents: vendorTotal,
          currency: 'USD',
          status: 'PENDING',
          paystackReference: reference,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          items: {
            create: vendorItems.map(item => ({
              listingId: item.id,
              quantity: item.quantity,
              priceCents: item.listing.priceCents,
              title: item.listing.title
            }))
          }
        },
        include: {
          items: true,
          vendor: {
            include: {
              user: true
            }
          }
        }
      })

      orders.push(order)

      // Update inventory
      for (const item of vendorItems) {
        await prisma.listing.update({
          where: { id: item.id },
          data: {
            inventory: {
              decrement: item.quantity
            }
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      orderId: orders[0].id, // Return first order ID
      orders: orders.map(o => o.id),
      reference,
      message: 'Orders created successfully'
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}
