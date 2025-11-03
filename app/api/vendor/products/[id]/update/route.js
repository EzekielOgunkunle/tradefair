import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

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

    // Verify product belongs to this vendor
    const existingProduct = await prisma.listing.findFirst({
      where: {
        id,
        vendorId: user.vendor.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    
    const title = formData.get('title')
    const description = formData.get('description')
    const priceCents = parseInt(formData.get('priceCents'))
    const inventory = parseInt(formData.get('inventory'))
    const categories = JSON.parse(formData.get('categories'))
    const existingImages = JSON.parse(formData.get('existingImages'))

    // Validate required fields
    if (!title || !description || !priceCents || !inventory || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Handle new images
    const newImages = []
    let imageIndex = 0
    while (formData.get(`image${imageIndex}`)) {
      // TODO: Upload to S3 and get URL
      // For now, using placeholder
      newImages.push('https://via.placeholder.com/500')
      imageIndex++
    }

    // Combine existing and new images
    const images = [...existingImages, ...newImages]

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    // Update the product
    const product = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description,
        priceCents,
        inventory,
        categories,
        images,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      product,
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    )
  }
}
