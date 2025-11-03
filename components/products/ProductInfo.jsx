'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, Package, Shield, TruckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { notifyAddedToCart } from '@/lib/toast-utils'
import { useRouter } from 'next/navigation'

export default function ProductInfo({ product }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const price = product.priceCents / 100
  const inStock = product.inventory > 0

  const handleAddToCart = () => {
    if (!inStock) return
    dispatch(addToCart({
      id: product.id,
      name: product.title,
      price: price,
      image: product.images?.[0] || '/placeholder.png',
      vendor: product.vendor?.name || 'Unknown Vendor',
      maxQuantity: product.inventory
    }))
    notifyAddedToCart(product.title, quantity)
  }

  const handleBuyNow = () => {
    if (!inStock) return
    handleAddToCart()
    router.push('/cart')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description.substring(0, 100),
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {product.title}
        </h1>
        
        {/* Rating & Reviews */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.averageRating || 0)
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {product.averageRating?.toFixed(1) || '0.0'}
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            ({product.reviewCount || 0} reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            ₦{price.toLocaleString()}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {product.currency}
          </span>
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <Package className={`w-5 h-5 ${inStock ? 'text-emerald-600' : 'text-red-600'}`} />
        <span className={`font-medium ${inStock ? 'text-emerald-600' : 'text-red-600'}`}>
          {inStock ? `In Stock (${product.inventory} available)` : 'Out of Stock'}
        </span>
      </div>

      {/* Categories */}
      {product.categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {inStock && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Quantity
          </h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="w-16 text-center font-medium text-gray-900 dark:text-white">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
              disabled={quantity >= product.inventory}
            >
              +
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
        
        <Button
          onClick={handleBuyNow}
          disabled={!inStock}
          variant="outline"
          className="w-full h-12 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-medium text-lg"
        >
          Buy Now
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="flex-1 h-12"
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="flex-1 h-12"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              Secure Payment
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Protected by Paystack
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <TruckIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              Fast Delivery
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Nationwide shipping
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
