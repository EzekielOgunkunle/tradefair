import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import ProductInfo from '@/components/products/ProductInfo'
import VendorCard from '@/components/products/VendorCard'
import ProductReviews from '@/components/products/ProductReviews'
import RelatedProducts from '@/components/products/RelatedProducts'
import Breadcrumbs from '@/components/products/Breadcrumbs'
import ActivityTracker from '@/components/ActivityTracker'

export async function generateMetadata({ params }) {
  const product = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      vendor: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!product) {
    return {
      title: 'Product Not Found - TradeFair',
    }
  }

  return {
    title: `${product.title} - TradeFair`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.substring(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

async function getProduct(id) {
  const product = await prisma.listing.findUnique({
    where: { id },
    include: {
      vendor: {
        include: {
          user: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
    },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  return product
}

async function getRelatedProducts(productId, categories, vendorId) {
  const relatedProducts = await prisma.listing.findMany({
    where: {
      id: { not: productId },
      isActive: true,
      OR: [
        { categories: { hasSome: categories } },
        { vendorId: vendorId },
      ],
    },
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
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return relatedProducts
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id)
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categories,
    product.vendorId
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Track product view */}
      <ActivityTracker listingId={product.id} activityType="VIEW_PRODUCT" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            {
              label: product.categories[0] || 'Category',
              href: `/products?category=${product.categories[0]}`,
            },
            { label: product.title, href: '#' },
          ]}
        />

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Image Gallery */}
          <ProductImageGallery images={product.images} title={product.title} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Vendor Info */}
        <div className="mt-12">
          <VendorCard vendor={product.vendor} />
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Description
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          {product.aiTags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.aiTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ProductReviews
            productId={product.id}
            reviews={product.reviews}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  )
}
