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

    const formData = await request.formData()
    
    const title = formData.get('title')
    const description = formData.get('description')
    const priceCents = parseInt(formData.get('priceCents'))
    const inventory = parseInt(formData.get('inventory'))
    const categories = JSON.parse(formData.get('categories'))

    // Validate required fields
    if (!title || !description || !priceCents || !inventory || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // For now, we'll use placeholder images since S3 is not yet set up
    // In production, you would upload these to S3
    const images = []
    let imageIndex = 0
    while (formData.get(`image${imageIndex}`)) {
      // TODO: Upload to S3 and get URL
      // For now, using placeholder
      images.push('https://via.placeholder.com/500')
      imageIndex++
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    // Create the product
    const product = await prisma.listing.create({
      data: {
        vendorId: user.vendor.id,
        title,
        description,
        priceCents,
        inventory,
        categories,
        images,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully'
    })

  } catch (error) {
    console.error('Add product error:', error)
    return NextResponse.json(
      { error: 'Failed to add product', details: error.message },
      { status: 500 }
    )
  }
}
