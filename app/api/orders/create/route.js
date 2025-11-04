import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { userId } = await auth()
    
    console.log('=== Order Creation Started ===')
    console.log('User ID:', userId)
    
    if (!userId) {
      console.log('ERROR: No userId from auth')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { items, shippingAddress, totalAmountCents, subtotalCents, deliveryFeeCents } = await request.json()
    
    console.log('Order data received:', {
      itemCount: items?.length,
      totalAmountCents,
      subtotalCents,
      deliveryFeeCents
    })

    // Validate request
    if (!items || items.length === 0) {
      console.log('ERROR: Cart is empty')
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      console.log('ERROR: Invalid shipping address')
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      )
    }

    // Get user from database or create if doesn't exist
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    console.log('User lookup result:', user ? `Found: ${user.displayName}` : 'Not found')

    if (!user) {
      console.log('Creating new user from Clerk data...')
      // Fallback: Create user if not found (webhook might have failed)
      const clerkUser = await currentUser()
      
      if (!clerkUser) {
        console.log('ERROR: Could not fetch Clerk user')
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

      console.log('User created:', user.displayName)
    }

    // Group items by vendor
    console.log('Processing cart items...')
    const itemsByVendor = {}
    for (const item of items) {
      console.log(`Checking product: ${item.id}`)
      // Fetch listing to get vendor
      const listing = await prisma.listing.findUnique({
        where: { id: item.id },
        include: { vendor: true }
      })

      if (!listing) {
        console.log(`ERROR: Product not found - ID: ${item.id}, Name: ${item.name}`)
        console.log('SOLUTION: Cart contains invalid product IDs. User needs to clear cart and re-add products.')
        return NextResponse.json(
          { 
            error: 'One or more products in your cart are no longer available. Please clear your cart and add products again.',
            invalidProductId: item.id,
            productName: item.name
          },
          { status: 400 }
        )
      }

      console.log(`Product found: ${listing.title}, Inventory: ${listing.inventory}`)

      // Check inventory
      if (listing.inventory < item.quantity) {
        console.log(`ERROR: Insufficient inventory for ${listing.title}`)
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
    const baseReference = `TF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    let orderIndex = 0
    for (const [vendorId, vendorItems] of Object.entries(itemsByVendor)) {
      const vendorTotal = vendorItems.reduce((sum, item) => 
        sum + (item.listing.priceCents * item.quantity), 0
      )

      // Generate unique reference for each order
      const orderReference = `${baseReference}-${orderIndex}`

      console.log(`Creating order ${orderIndex + 1} for vendor ${vendorId}, Reference: ${orderReference}`)

      // Create order
      const order = await prisma.order.create({
        data: {
          buyerId: user.id,
          vendorId,
          totalAmountCents: vendorTotal,
          currency: 'USD',
          status: 'PENDING',
          paystackReference: orderReference,
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
      orderIndex++

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

    console.log(`✓ Successfully created ${orders.length} order(s)`)

    return NextResponse.json({
      success: true,
      orderId: orders[0].id, // Return first order ID for backward compatibility
      orders: orders.map(o => ({ id: o.id, reference: o.paystackReference })),
      reference: baseReference, // Base reference for tracking
      message: `Successfully created ${orders.length} order(s)`
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}
