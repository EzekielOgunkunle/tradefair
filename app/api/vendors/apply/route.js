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

    const { businessName, businessDescription, phoneNumber, address } = await request.json()

    // Validate required fields
    if (!businessName || !businessDescription || !phoneNumber) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { vendor: true }
    })

    if (!user) {
      const clerkUser = await currentUser()
      
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
    }

    // Check if user already has a vendor account or pending application
    if (user.vendor) {
      return NextResponse.json(
        { error: 'You already have a vendor account or pending application' },
        { status: 400 }
      )
    }

    // Create vendor application (PENDING approval)
    const vendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        businessName,
        businessDescription,
        phoneNumber,
        address: address || '',
        status: 'PENDING', // Requires admin approval
      }
    })

    // Update user role to indicate vendor application
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'VENDOR' }
    })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! Admin will review it shortly.',
      vendor: {
        id: vendor.id,
        businessName: vendor.businessName,
        status: vendor.status
      }
    })

  } catch (error) {
    console.error('Vendor application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    )
  }
}
