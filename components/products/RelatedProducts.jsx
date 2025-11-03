'use client'

import AnimatedProductCard from './AnimatedProductCard'

export default function RelatedProducts({ products }) {
  const transformedProducts = products.map((product) => ({
    id: product.id,
    name: product.title,
    image: product.images[0] || '/placeholder-product.jpg',
    price: product.priceCents / 100,
    originalPrice: null,
    vendor: product.vendor.user.displayName,
    rating: product.averageRating || 0,
    reviewCount: product.reviewCount || 0,
    featured: false,
    inStock: product.inventory > 0,
  }))

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {transformedProducts.map((product) => (
          <AnimatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
