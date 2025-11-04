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
    // African Fabrics & Textiles products (10 products)
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Premium Ankara Fabric - Vibrant Patterns',
        description: 'High-quality 100% cotton ankara fabric with vibrant African patterns. Perfect for dresses, shirts, and home decor. 6 yards per piece.',
        priceCents: 8500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1558769132-cb1aea5f7c86?w=800',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        ],
        inventory: 45,
        stockQuantity: 45,
        categories: ['Fashion', 'Fabrics', 'Ankara'],
        aiTags: ['african prints', 'ankara', 'cotton fabric', 'vibrant'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Authentic Kente Cloth - Ghanaian Heritage',
        description: 'Traditional Ghanaian kente cloth handwoven with symbolic patterns. Perfect for special occasions and cultural events.',
        priceCents: 25000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1617127365203-c9860be34e42?w=800',
        ],
        inventory: 12,
        stockQuantity: 12,
        categories: ['Fashion', 'Fabrics', 'Kente'],
        aiTags: ['kente', 'ghanaian', 'traditional', 'handwoven'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Aso-Oke Fabric Set - Traditional Nigerian',
        description: 'Premium Aso-Oke fabric set, hand-woven with gold threading. Ideal for weddings and cultural ceremonies.',
        priceCents: 45000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
        ],
        inventory: 8,
        stockQuantity: 8,
        categories: ['Fashion', 'Fabrics', 'Aso-Oke'],
        aiTags: ['aso-oke', 'nigerian', 'wedding', 'premium'],
        isActive: true,
        averageRating: 5.0,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Batik Print Fabric - Indonesian Style',
        description: 'Beautiful batik print fabric with intricate Indonesian-inspired designs. Soft and breathable cotton material.',
        priceCents: 7500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800',
        ],
        inventory: 60,
        stockQuantity: 60,
        categories: ['Fashion', 'Fabrics', 'Batik'],
        aiTags: ['batik', 'indonesian', 'prints', 'cotton'],
        isActive: true,
        averageRating: 4.6,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Dashiki Fabric - Bold African Print',
        description: 'Vibrant dashiki fabric with bold geometric patterns. Perfect for making traditional African shirts and dresses.',
        priceCents: 9500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
        ],
        inventory: 35,
        stockQuantity: 35,
        categories: ['Fashion', 'Fabrics', 'Dashiki'],
        aiTags: ['dashiki', 'african', 'geometric', 'bold'],
        isActive: true,
        averageRating: 4.7,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Adire Fabric - Indigo Dye Textile',
        description: 'Traditional Nigerian Adire fabric with beautiful indigo dye patterns. Hand-tie-dyed using ancient techniques.',
        priceCents: 12000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800',
        ],
        inventory: 20,
        stockQuantity: 20,
        categories: ['Fashion', 'Fabrics', 'Adire'],
        aiTags: ['adire', 'indigo', 'tie-dye', 'nigerian'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Mudcloth Fabric - Mali Bogolan',
        description: 'Authentic Malian mudcloth (Bogolan) with traditional symbols and patterns. Each piece tells a unique story.',
        priceCents: 18000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
        ],
        inventory: 15,
        stockQuantity: 15,
        categories: ['Fashion', 'Fabrics', 'Mudcloth'],
        aiTags: ['mudcloth', 'bogolan', 'mali', 'traditional'],
        isActive: true,
        averageRating: 5.0,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Lace Fabric - African French Lace',
        description: 'Elegant African French lace fabric perfect for weddings and special occasions. Delicate embroidery and premium quality.',
        priceCents: 28000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800',
        ],
        inventory: 18,
        stockQuantity: 18,
        categories: ['Fashion', 'Fabrics', 'Lace'],
        aiTags: ['lace', 'french', 'wedding', 'elegant'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'Kitenge Fabric - East African Print',
        description: 'Colorful Kitenge fabric from East Africa. Bold patterns and vibrant colors perfect for various fashion projects.',
        priceCents: 8000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1509319117443-24d5a46d0b45?w=800',
        ],
        inventory: 50,
        stockQuantity: 50,
        categories: ['Fashion', 'Fabrics', 'Kitenge'],
        aiTags: ['kitenge', 'east african', 'colorful', 'print'],
        isActive: true,
        averageRating: 4.7,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[0].id,
        title: 'George Fabric - Luxury Wrapper',
        description: 'Premium George wrapper fabric with intricate designs. Heavy quality fabric perfect for special occasions.',
        priceCents: 38000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
        ],
        inventory: 10,
        stockQuantity: 10,
        categories: ['Fashion', 'Fabrics', 'George'],
        aiTags: ['george', 'wrapper', 'luxury', 'premium'],
        isActive: true,
        averageRating: 4.9,
      },
    }),

    // Northern Beads & Crafts products (10 products)
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Handcrafted Waist Beads - Traditional Colors',
        description: 'Beautiful handcrafted waist beads in traditional African colors. Made with high-quality glass beads, adjustable size.',
        priceCents: 3500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800',
        ],
        inventory: 100,
        stockQuantity: 100,
        categories: ['Jewelry', 'Beads', 'Accessories'],
        aiTags: ['waist beads', 'handcrafted', 'traditional', 'jewelry'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'African Necklace Set - Amber & Black',
        description: 'Stunning necklace and earring set featuring amber and black beads. Perfect statement piece for any outfit.',
        priceCents: 12000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        ],
        inventory: 25,
        stockQuantity: 25,
        categories: ['Jewelry', 'Necklaces', 'Sets'],
        aiTags: ['necklace', 'amber', 'statement jewelry', 'african'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Woven Basket Set - Handmade Storage',
        description: 'Set of 3 handwoven baskets perfect for storage and home decor. Made by local artisans using traditional techniques.',
        priceCents: 18000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1588263823984-d1eabdb717f4?w=800',
        ],
        inventory: 15,
        stockQuantity: 15,
        categories: ['Home & Living', 'Storage', 'Handmade'],
        aiTags: ['baskets', 'handwoven', 'storage', 'home decor'],
        isActive: true,
        averageRating: 4.7,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Cowrie Shell Anklet - Beach Vibes',
        description: 'Trendy anklet featuring cowrie shells and colorful beads. Perfect for summer and beach outfits.',
        priceCents: 2500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
        ],
        inventory: 80,
        stockQuantity: 80,
        categories: ['Jewelry', 'Anklets', 'Beach'],
        aiTags: ['anklet', 'cowrie shells', 'beach', 'summer'],
        isActive: true,
        averageRating: 4.6,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Brass Bracelet Set - African Heritage',
        description: 'Set of 3 brass bracelets with traditional African engravings. Adjustable size fits most wrists.',
        priceCents: 8500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        ],
        inventory: 40,
        stockQuantity: 40,
        categories: ['Jewelry', 'Bracelets', 'Brass'],
        aiTags: ['brass', 'bracelets', 'african', 'heritage'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Turquoise Stone Earrings - Handmade',
        description: 'Beautiful handmade earrings featuring genuine turquoise stones. Lightweight and comfortable for all-day wear.',
        priceCents: 6500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
        ],
        inventory: 30,
        stockQuantity: 30,
        categories: ['Jewelry', 'Earrings', 'Gemstones'],
        aiTags: ['earrings', 'turquoise', 'handmade', 'gemstones'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Leather Cord Necklace - Tribal Design',
        description: 'Masculine leather cord necklace with tribal pendant. Perfect gift for men who appreciate artisan jewelry.',
        priceCents: 7500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
        ],
        inventory: 35,
        stockQuantity: 35,
        categories: ['Jewelry', 'Necklaces', 'Men'],
        aiTags: ['leather', 'tribal', 'mens jewelry', 'necklace'],
        isActive: true,
        averageRating: 4.7,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Beaded Wall Hanging - Art Decor',
        description: 'Stunning beaded wall hanging featuring traditional patterns. Handmade by skilled artisans, perfect for home decoration.',
        priceCents: 15000,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
        ],
        inventory: 12,
        stockQuantity: 12,
        categories: ['Home & Living', 'Wall Art', 'Beads'],
        aiTags: ['wall hanging', 'beaded', 'art', 'home decor'],
        isActive: true,
        averageRating: 5.0,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Seed Bead Choker - Colorful Pattern',
        description: 'Vibrant seed bead choker with intricate colorful patterns. Handwoven using traditional techniques.',
        priceCents: 5500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=800',
        ],
        inventory: 45,
        stockQuantity: 45,
        categories: ['Jewelry', 'Necklaces', 'Chokers'],
        aiTags: ['choker', 'seed beads', 'colorful', 'handwoven'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[1].id,
        title: 'Macrame Plant Hanger - Boho Style',
        description: 'Handmade macrame plant hanger in boho style. Perfect for hanging indoor plants and adding a natural touch to your home.',
        priceCents: 9500,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800',
        ],
        inventory: 20,
        stockQuantity: 20,
        categories: ['Home & Living', 'Plant Accessories', 'Macrame'],
        aiTags: ['macrame', 'plant hanger', 'boho', 'handmade'],
        isActive: true,
        averageRating: 4.7,
      },
    }),

    // Lagos Tech Gadgets products (15 products)
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'iPhone 13 Pro - 256GB (Unlocked)',
        description: 'Brand new iPhone 13 Pro with 256GB storage. Unlocked for all networks. Includes original accessories and 1-year warranty.',
        priceCents: 99900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800',
        ],
        inventory: 5,
        stockQuantity: 5,
        categories: ['Electronics', 'Smartphones', 'Apple'],
        aiTags: ['iphone', 'smartphone', 'apple', '256gb'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Samsung Galaxy Buds Pro - Wireless Earbuds',
        description: 'Premium wireless earbuds with active noise cancellation. Crystal clear sound and 8-hour battery life.',
        priceCents: 19900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
        ],
        inventory: 30,
        stockQuantity: 30,
        categories: ['Electronics', 'Audio', 'Samsung'],
        aiTags: ['earbuds', 'wireless', 'samsung', 'noise cancellation'],
        isActive: true,
        averageRating: 4.7,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'HP Laptop - Core i5, 8GB RAM, 512GB SSD',
        description: 'HP 15.6" laptop with Intel Core i5 processor, 8GB RAM, and 512GB SSD. Perfect for work and entertainment.',
        priceCents: 64999,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        ],
        inventory: 8,
        stockQuantity: 8,
        categories: ['Electronics', 'Laptops', 'HP'],
        aiTags: ['laptop', 'hp', 'core i5', 'ssd'],
        isActive: true,
        averageRating: 4.6,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Apple Watch Series 7 - GPS + Cellular',
        description: 'Apple Watch Series 7 with GPS and Cellular. Track your fitness, stay connected, and monitor your health.',
        priceCents: 42900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
        ],
        inventory: 12,
        stockQuantity: 12,
        categories: ['Electronics', 'Wearables', 'Apple'],
        aiTags: ['apple watch', 'smartwatch', 'fitness', 'cellular'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Sony WH-1000XM4 Wireless Headphones',
        description: 'Industry-leading noise cancellation headphones. 30-hour battery life, premium sound quality, and comfortable design.',
        priceCents: 34900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
        ],
        inventory: 18,
        stockQuantity: 18,
        categories: ['Electronics', 'Audio', 'Sony'],
        aiTags: ['headphones', 'sony', 'noise cancellation', 'wireless'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Dell XPS 13 - Ultra Portable Laptop',
        description: 'Dell XPS 13 with 11th Gen Intel Core i7, 16GB RAM, 512GB SSD. Stunning 13.4" InfinityEdge display.',
        priceCents: 129900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
        ],
        inventory: 6,
        stockQuantity: 6,
        categories: ['Electronics', 'Laptops', 'Dell'],
        aiTags: ['laptop', 'dell', 'xps', 'portable'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'iPad Air - 10.9" with Apple Pencil Support',
        description: 'iPad Air with powerful M1 chip, 10.9" Liquid Retina display, and support for Apple Pencil 2. 256GB storage.',
        priceCents: 74900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        ],
        inventory: 10,
        stockQuantity: 10,
        categories: ['Electronics', 'Tablets', 'Apple'],
        aiTags: ['ipad', 'tablet', 'apple', 'm1 chip'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Samsung 4K Smart TV - 55 Inch',
        description: '55" Samsung 4K UHD Smart TV with HDR, built-in apps, and voice control. Stunning picture quality.',
        priceCents: 64900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
        ],
        inventory: 7,
        stockQuantity: 7,
        categories: ['Electronics', 'TVs', 'Samsung'],
        aiTags: ['smart tv', '4k', 'samsung', '55 inch'],
        isActive: true,
        averageRating: 4.7,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Canon EOS M50 Mark II - Mirrorless Camera',
        description: 'Canon mirrorless camera with 24.1MP sensor, 4K video, and vlogging features. Perfect for content creators.',
        priceCents: 69900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        ],
        inventory: 5,
        stockQuantity: 5,
        categories: ['Electronics', 'Cameras', 'Canon'],
        aiTags: ['camera', 'mirrorless', 'canon', '4k'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Logitech MX Master 3 - Wireless Mouse',
        description: 'Premium wireless mouse with ergonomic design, customizable buttons, and ultra-fast scrolling. Works on any surface.',
        priceCents: 9900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
        ],
        inventory: 25,
        stockQuantity: 25,
        categories: ['Electronics', 'Accessories', 'Logitech'],
        aiTags: ['mouse', 'wireless', 'logitech', 'ergonomic'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Nintendo Switch OLED - Gaming Console',
        description: 'Nintendo Switch OLED model with vibrant 7" screen, enhanced audio, and 64GB storage. Play anywhere, anytime.',
        priceCents: 34900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800',
        ],
        inventory: 15,
        stockQuantity: 15,
        categories: ['Electronics', 'Gaming', 'Nintendo'],
        aiTags: ['nintendo switch', 'gaming', 'console', 'oled'],
        isActive: true,
        averageRating: 4.9,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Anker PowerCore 20000mAh Power Bank',
        description: 'High-capacity power bank with dual USB ports. Fast charging for multiple devices, perfect for travel.',
        priceCents: 4900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800',
        ],
        inventory: 50,
        stockQuantity: 50,
        categories: ['Electronics', 'Accessories', 'Chargers'],
        aiTags: ['power bank', 'anker', 'portable charger', '20000mah'],
        isActive: true,
        averageRating: 4.8,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'Razer DeathAdder V2 - Gaming Mouse',
        description: 'Professional gaming mouse with 20K DPI optical sensor, 8 programmable buttons, and ergonomic design for long sessions.',
        priceCents: 6900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800',
        ],
        inventory: 20,
        stockQuantity: 20,
        categories: ['Electronics', 'Gaming', 'Razer'],
        aiTags: ['gaming mouse', 'razer', 'dpi', 'esports'],
        isActive: true,
        averageRating: 4.7,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'MacBook Pro 14" - M1 Pro Chip',
        description: 'MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD, stunning Liquid Retina XDR display. Power for professionals.',
        priceCents: 199900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        ],
        inventory: 4,
        stockQuantity: 4,
        categories: ['Electronics', 'Laptops', 'Apple'],
        aiTags: ['macbook', 'apple', 'm1 pro', 'professional'],
        isActive: true,
        averageRating: 5.0,
      },
    }),
    prisma.listing.create({
      data: {
        vendorId: vendors[2].id,
        title: 'DJI Mini 3 Pro - Compact Drone',
        description: 'Ultra-portable drone with 4K HDR video, intelligent features, and extended flight time. Perfect for aerial photography.',
        priceCents: 75900,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
        ],
        inventory: 8,
        stockQuantity: 8,
        categories: ['Electronics', 'Drones', 'DJI'],
        aiTags: ['drone', 'dji', '4k', 'aerial photography'],
        isActive: true,
        averageRating: 4.9,
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
