'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDispatch } from 'react-redux'
import { notifyAddedToCart } from '@/lib/toast-utils'

/**
 * Animated Product Card Component
 * Features hover animations, scale effects, and interactive elements
 * 
 * @param {Object} product - Product data
 * @param {string} product.id - Product ID
 * @param {string} product.name - Product name
 * @param {string} product.image - Product image URL
 * @param {number} product.price - Product price
 * @param {number} product.originalPrice - Original price (if on sale)
 * @param {string} product.vendor - Vendor name
 * @param {number} product.rating - Product rating (0-5)
 * @param {boolean} product.featured - Is featured product
const AnimatedProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const dispatch = useDispatch()
    const currency = '₦' // Nigerian Naira
    const [isHovered, setIsHovered] = React.useState(false)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // Calculate discount percentage
    const discount = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    // Animation variants
    const cardVariants = {
        initial: { scale: 1, y: 0 },
        hover: { 
            scale: 1.03,
            y: -8,
            transition: {
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1]
            }
        }
    }

    const imageVariants = {
        initial: { scale: 1 },
        hover: { 
            scale: 1.1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    }

    const overlayVariants = {
        initial: { opacity: 0 },
        hover: { 
            opacity: 1,
            transition: {
                duration: 0.2
            }
        }
    }

    const actionsVariants = {
        initial: { opacity: 0, y: 20 },
        hover: { 
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05
            }
        }
    }
    const buttonVariants = {
        initial: { opacity: 0, y: 10 },
        hover: { opacity: 1, y: 0 }
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!product.inStock) return

        // Dispatch to Redux cart
        // dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }))
        
        // Show toast notification
        notifyAddedToCart(product.name)
    }

    return (
    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200 transition-shadow"
        >
            {/* Image Container */}
            <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <motion.div variants={imageVariants}>
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>

                    {/* Overlay with quick actions */}
                    <motion.div
                        variants={overlayVariants}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    >
                        <motion.div
                            variants={actionsVariants}
                            className="absolute top-4 right-4 flex flex-col gap-2"
                        >
                            <motion.button
                                variants={buttonVariants}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-emerald-50 transition-colors"
                                aria-label="Add to wishlist"
                            >
                                <Heart className="w-5 h-5 text-slate-700" />
                            </motion.button>
                            <motion.button
                                variants={buttonVariants}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-emerald-50 transition-colors"
                                aria-label="Quick view"
                            >
                                <Eye className="w-5 h-5 text-slate-700" />
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.featured && (
                            <Badge className="bg-emerald-600 text-white font-semibold">
                                Featured
                            </Badge>
                        )}
                        {discount > 0 && (
                            <Badge variant="secondary" className="bg-amber-500 text-white font-semibold">
                                -{discount}%
                            </Badge>
                        )}
                        {!product.inStock && (
                            <Badge variant="destructive" className="font-semibold">
                                Out of Stock
                            </Badge>
                        )}
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                {/* Vendor Badge */}
                {product.vendor && (
                    <Badge variant="outline" className="mb-2 text-xs bg-amber-50 border-amber-200 text-amber-700">
                        {product.vendor}
                    </Badge>
                )}

                {/* Product Name */}
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors mb-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(product.rating)
                                            ? 'text-amber-500 fill-amber-500'
                                            : 'text-slate-300 fill-slate-300'
                                    }`}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-slate-600">({product.rating})</span>
                    </div>
                )}
                    {/* Add to Cart Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            size="icon"
                            onClick={handleAddToCart}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-200"
                            disabled={!product.inStock}
                            aria-label="Add to cart"
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </Button>
                    </motion.div>
                    {/* Add to Cart Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            size="icon"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-200"
                            disabled={!product.inStock}
                            aria-label="Add to cart"
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default AnimatedProductCard
