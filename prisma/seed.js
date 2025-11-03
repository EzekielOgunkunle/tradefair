const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.notification.deleteMany()
  await prisma.platformRevenue.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin Users
  console.log('👤 Creating admin users...')
  const admin = await prisma.user.create({
    data: {
      clerkId: 'user_admin_001',
      displayName: 'Admin User',
      email: 'admin@tradefair.com',
      role: 'ADMIN',
      roleAssigned: true,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  })

  // Create Buyer Users
  console.log('🛍️  Creating buyer users...')
  const buyers = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: 'user_buyer_001',
        displayName: 'Amina Mohammed',
        email: 'amina.mohammed@gmail.com',
        role: 'BUYER',
        roleAssigned: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amina',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_buyer_002',
        displayName: 'Chidi Okonkwo',
        email: 'chidi.okonkwo@gmail.com',
        role: 'BUYER',
        roleAssigned: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chidi',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_buyer_003',
        displayName: 'Fatima Bello',
        email: 'fatima.bello@gmail.com',
        role: 'BUYER',
        roleAssigned: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
      },
    }),
  ])

  // Create Vendor Users
  console.log('🏪 Creating vendor users...')
  const vendorUsers = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: 'user_vendor_001',
        displayName: 'Kwame Asante',
        email: 'kwame@africanfabrics.com',
        role: 'VENDOR',
        roleAssigned: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kwame',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_vendor_002',
        displayName: 'Zainab Ibrahim',
        email: 'zainab@northernbeads.com',
        role: 'VENDOR',
        roleAssigned: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zainab',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_vendor_003',
        displayName: 'Tunde Adebayo',
        email: 'tunde@lagosgadgets.com',
        role: 'VENDOR',
        roleAssigned: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tunde',
      },
    }),
  ])

  // Create Vendors
  console.log('🏢 Creating vendor businesses...')
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        userId: vendorUsers[0].id,
        businessName: 'African Fabrics & Textiles',
        businessAddress: '12 Broad Street, Lagos Island, Lagos',
        businessDescription: 'Authentic African fabrics, ankara, kente, and traditional textiles',
        phoneNumber: '+234 803 123 4567',
        contactEmail: 'sales@africanfabrics.com',
        rating: 4.8,
        kycDocuments: ['https://example.com/kyc/vendor1_cac.pdf'],
        bankName: 'Access Bank',
        accountNumber: '0123456789',
        accountName: 'African Fabrics Ltd',
        status: 'APPROVED',
        plan: 'VENDOR_PRO',
        approvedAt: new Date(),
      },
    }),
    prisma.vendor.create({
      data: {
        userId: vendorUsers[1].id,
        businessName: 'Northern Beads & Crafts',
        businessAddress: '45 Ahmadu Bello Way, Kaduna',
        businessDescription: 'Handcrafted jewelry, beads, and traditional Northern Nigerian crafts',
        phoneNumber: '+234 806 234 5678',
        contactEmail: 'info@northernbeads.com',
        rating: 4.9,
        kycDocuments: ['https://example.com/kyc/vendor2_cac.pdf'],
        bankName: 'GTBank',
        accountNumber: '0234567890',
        accountName: 'Northern Beads Enterprise',
        status: 'APPROVED',
        plan: 'FREE',
        approvedAt: new Date(),
      },
    }),
    prisma.vendor.create({
      data: {
        userId: vendorUsers[2].id,
        businessName: 'Lagos Tech Gadgets',
        businessAddress: '78 Allen Avenue, Ikeja, Lagos',
        businessDescription: 'Latest smartphones, laptops, and tech accessories',
        phoneNumber: '+234 809 345 6789',
        contactEmail: 'support@lagosgadgets.com',
        rating: 4.6,
        kycDocuments: ['https://example.com/kyc/vendor3_cac.pdf'],
        bankName: 'Zenith Bank',
        accountNumber: '0345678901',
        accountName: 'Lagos Tech Gadgets Ltd',
        status: 'APPROVED',
        plan: 'VENDOR_PRO',
        approvedAt: new Date(),
      },
    }),
  ])

  // Create Product Listings
  console.log('📦 Creating product listings...')
  const listings = await Promise.all([
    // African Fabrics & Textiles products
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Premium Ankara Fabric - Vibrant Patterns',
        description: 'High-quality 100% cotton ankara fabric with vibrant African patterns. Perfect for dresses, shirts, and home decor. 6 yards per piece.',
        priceCents: 8500,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1558769132-cb1aea5f-cc86?w=800',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        ],
        inventory: 45,
        categories: ['Fashion', 'Fabrics', 'Ankara'],
        aiTags: ['african prints', 'ankara', 'cotton fabric', 'vibrant'],
        isActive: true,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Authentic Kente Cloth - Ghanaian Heritage',
        description: 'Traditional Ghanaian kente cloth handwoven with symbolic patterns. Perfect for special occasions and cultural events.',
        priceCents: 25000,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1617127365203-c9860be34e42?w=800',
        ],
        inventory: 12,
        categories: ['Fashion', 'Fabrics', 'Kente'],
        aiTags: ['kente', 'ghanaian', 'traditional', 'handwoven'],
        isActive: true,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Aso-Oke Fabric Set - Traditional Nigerian',
        description: 'Premium Aso-Oke fabric set, hand-woven with gold threading. Ideal for weddings and cultural ceremonies.',
        priceCents: 45000,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
        ],
        inventory: 8,
        categories: ['Fashion', 'Fabrics', 'Aso-Oke'],
        aiTags: ['aso-oke', 'nigerian', 'wedding', 'premium'],
        isActive: true,
      },
    }),

    // Northern Beads & Crafts products
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Handcrafted Waist Beads - Traditional Colors',
        description: 'Beautiful handcrafted waist beads in traditional African colors. Made with high-quality glass beads, adjustable size.',
        priceCents: 3500,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800',
        ],
        inventory: 100,
        categories: ['Jewelry', 'Beads', 'Accessories'],
        aiTags: ['waist beads', 'handcrafted', 'traditional', 'jewelry'],
        isActive: true,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'African Necklace Set - Amber & Black',
        description: 'Stunning necklace and earring set featuring amber and black beads. Perfect statement piece for any outfit.',
        priceCents: 12000,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        ],
        inventory: 25,
        categories: ['Jewelry', 'Necklaces', 'Sets'],
        aiTags: ['necklace', 'amber', 'statement jewelry', 'african'],
        isActive: true,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Woven Basket Set - Handmade Storage',
        description: 'Set of 3 handwoven baskets perfect for storage and home decor. Made by local artisans using traditional techniques.',
        priceCents: 18000,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1588263823984-d1eabdb717f4?w=800',
        ],
        inventory: 15,
        categories: ['Home & Living', 'Storage', 'Handmade'],
        aiTags: ['baskets', 'handwoven', 'storage', 'home decor'],
        isActive: true,
      },
    }),

    // Lagos Tech Gadgets products
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'iPhone 13 Pro - 256GB (Unlocked)',
        description: 'Brand new iPhone 13 Pro with 256GB storage. Unlocked for all networks. Includes original accessories and 1-year warranty.',
        priceCents: 650000,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800',
        ],
        inventory: 5,
        categories: ['Electronics', 'Smartphones', 'Apple'],
        aiTags: ['iphone', 'smartphone', 'apple', '256gb'],
        isActive: true,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Samsung Galaxy Buds Pro - Wireless Earbuds',
        description: 'Premium wireless earbuds with active noise cancellation. Crystal clear sound and 8-hour battery life.',
        priceCents: 85000,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
        ],
        inventory: 30,
        categories: ['Electronics', 'Audio', 'Samsung'],
        aiTags: ['earbuds', 'wireless', 'samsung', 'noise cancellation'],
        isActive: true,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'HP Laptop - Core i5, 8GB RAM, 512GB SSD',
        description: 'HP 15.6" laptop with Intel Core i5 processor, 8GB RAM, and 512GB SSD. Perfect for work and entertainment.',
        priceCents: 385000,
        currency: 'NGN',
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        ],
        inventory: 8,
        categories: ['Electronics', 'Laptops', 'HP'],
        aiTags: ['laptop', 'hp', 'core i5', 'ssd'],
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${listings.length} product listings`)

  console.log('✨ Seed completed successfully!')
  console.log(`
📊 Summary:
- ${1} Admin user
- ${buyers.length} Buyers
- ${vendors.length} Vendors
- ${listings.length} Products
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
