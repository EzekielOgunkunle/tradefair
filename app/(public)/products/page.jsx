import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters from '@/components/products/ProductFilters'
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton'
import AdvancedSearch from '@/components/products/AdvancedSearch'
import { Package } from 'lucide-react'

export const metadata = {
  title: 'Products - TradeFair',
  description: 'Browse quality products from verified African vendors',
}

async function getProducts(searchParams) {
  const page = Number(searchParams.page) || 1
  const limit = 12
  const skip = (page - 1) * limit
  const search = searchParams.search || ''
  const category = searchParams.category || ''
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const minRating = searchParams.minRating ? Number(searchParams.minRating) : undefined
  const inStock = searchParams.inStock === 'true'
  const sortBy = searchParams.sortBy || 'newest'

  // Build where clause
  const where = {
    isActive: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { aiTags: { has: search } },
      ],
    }),
    ...(category && { categories: { has: category } }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          priceCents: {
            ...(minPrice !== undefined && { gte: minPrice * 100 }),
            ...(maxPrice !== undefined && { lte: maxPrice * 100 }),
          },
        }
      : {}),
    ...(minRating !== undefined && { averageRating: { gte: minRating } }),
    ...(inStock && { stockQuantity: { gt: 0 } }),
  }

  // Build orderBy clause
  let orderBy = {}
  switch (sortBy) {
    case 'price-asc':
      orderBy = { priceCents: 'asc' }
      break
    case 'price-desc':
      orderBy = { priceCents: 'desc' }
      break
    case 'rating':
      orderBy = { averageRating: 'desc' }
      break
    case 'popular':
      orderBy = { reviewCount: 'desc' }
      break
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' }
      break
  }

  // Fetch products and total count in parallel
  const [products, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        vendor: {
          include: {
            user: {
              select: {
                displayName: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ])

  // Get all unique categories
  const allProducts = await prisma.listing.findMany({
    where: { isActive: true },
    select: { categories: true },
  })
  const categories = [...new Set(allProducts.flatMap((p) => p.categories))].sort()

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    categories,
  }
}

export default async function ProductsPage({ searchParams }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Quality Products
              </h1>
              <p className="text-lg md:text-xl text-emerald-50">
                Shop from verified vendors across Africa
              </p>
            </div>
            <AdvancedSearch />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

async function ProductsContent({ searchParams }) {
  const { products, totalCount, totalPages, currentPage, categories } = await getProducts(searchParams)

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          No products found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:w-64 flex-shrink-0">
        <ProductFilters categories={categories} searchParams={searchParams} />
      </aside>

      {/* Products Grid */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> products
          </p>
        </div>

        <ProductGrid
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}
