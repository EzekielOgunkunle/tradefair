'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AIRecommendations({ limit = 10, showTitle = true }) {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personalized, setPersonalized] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recommendations?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations || []);
        setPersonalized(data.personalized || false);
      } else {
        toast.error('Failed to load recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackActivity = async (listingId, activityType) => {
    try {
      await fetch('/api/activity/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, activityType }),
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  const handleProductClick = (listingId) => {
    trackActivity(listingId, 'VIEW_PRODUCT');
  };

  const handleAddToCart = (listing, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart logic (you can dispatch Redux action here)
    trackActivity(listing.id, 'ADD_TO_CART');
    toast.success('Added to cart!');
  };

  const scrollLeft = () => {
    const container = document.getElementById('recommendations-scroll');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('recommendations-scroll');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium">Loading AI recommendations...</span>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {showTitle && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-emerald-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {personalized ? 'Recommended For You' : 'Trending Products'}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {personalized
                  ? 'Personalized picks based on your preferences'
                  : 'Popular products you might like'}
              </p>
              {personalized && (
                <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              )}
            </div>
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Products Carousel */}
        <div className="relative">
          <div
            id="recommendations-scroll"
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recommendations.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-72"
              >
                <Link
                  href={`/product/${product.id}`}
                  onClick={() => handleProductClick(product.id)}
                  className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <TrendingUp className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    {/* Overlay badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.averageRating >= 4.5 && (
                        <Badge className="bg-amber-500 text-white">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Top Rated
                        </Badge>
                      )}
                      {personalized && index < 3 && (
                        <Badge className="bg-emerald-600 text-white">
                          <Sparkles className="h-3 w-3 mr-1" />
                          For You
                        </Badge>
                      )}
                    </div>
                    {/* Quick add to cart */}
                    <Button
                      size="icon"
                      onClick={(e) => handleAddToCart(product, e)}
                      className="absolute bottom-4 right-4 rounded-full bg-white/90 hover:bg-white text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Category */}
                    {product.categories && product.categories.length > 0 && (
                      <Badge
                        variant="outline"
                        className="mb-2 text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        {product.categories[0]}
                      </Badge>
                    )}

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {product.title}
                    </h3>

                    {/* Vendor */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      by {product.vendor?.user?.displayName || 'Vendor'}
                    </p>

                    {/* Rating */}
                    {product.reviewCount > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(product.averageRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({product.reviewCount})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(product.priceCents)}
                      </span>
                      {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                          Only {product.stockQuantity} left
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        {recommendations.length >= limit && (
          <div className="text-center mt-8">
            <Link href="/products">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                View All Products
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
