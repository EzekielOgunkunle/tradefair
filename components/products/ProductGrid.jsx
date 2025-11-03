'use client'

import AnimatedProductCard from './AnimatedProductCard'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ProductGrid({ products, currentPage, totalPages }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Transform products to match AnimatedProductCard expected format
  const transformedProducts = products.map((product) => ({
    id: product.id,
    name: product.title,
    image: product.images[0] || '/placeholder-product.jpg',
    price: product.priceCents / 100,
    originalPrice: null, // Can be calculated from promotions if needed
    vendor: product.vendor.user.displayName,
    rating: product.averageRating || 0,
    reviewCount: product._count.reviews,
    featured: false, // Can be determined by business logic
    inStock: product.inventory > 0,
  }))

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {transformedProducts.map((product) => (
          <AnimatedProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)

              if (!showPage) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  )
                }
                return null
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  className={`rounded-full ${
                    currentPage === page
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : ''
                  }`}
                >
                  {page}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  )
}
