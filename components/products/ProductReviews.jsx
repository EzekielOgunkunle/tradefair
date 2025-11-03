'use client'

import Image from 'next/image'
import { Star, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function ProductReviews({ productId, reviews, averageRating, reviewCount }) {
  const [showAll, setShowAll] = useState(false)
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === rating).length
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Rating Summary */}
        <div className="text-center lg:text-left">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {averageRating?.toFixed(1) || '0.0'}
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating || 0)
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-2 space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                {rating}★
              </span>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="flex gap-4">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  {review.user.avatarUrl ? (
                    <Image
                      src={review.user.avatarUrl}
                      alt={review.user.displayName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.user.displayName}
                    </h4>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                  )}

                  {/* Date */}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {reviews.length > 3 && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="min-w-[200px]"
              >
                {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  )
}
