'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Image as ImageIcon,
  CheckCircle2,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function ProductReviews({ listingId, orderId = null }) {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [respondingTo, setRespondingTo] = useState(null);
  const [vendorResponse, setVendorResponse] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/listings/${listingId}/reviews?page=${page}&sortBy=${sortBy}`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setStats(data.stats);
        setPagination(data.pagination);
      } else {
        toast.error(data.error || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listingId, page, sortBy]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    if (!orderId) {
      toast.error('Order ID is required to submit a review');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          rating,
          comment,
          images: [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Review submitted successfully!');
        setWriteReviewOpen(false);
        setRating(0);
        setComment('');
        fetchReviews();
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleHelpful = async (reviewId) => {
    if (!user) {
      toast.error('Please sign in to mark reviews as helpful');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Update review in state
        setReviews(
          reviews.map((r) =>
            r.id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r
          )
        );
      } else {
        toast.error(data.error || 'Failed to update helpful vote');
      }
    } catch (error) {
      console.error('Error toggling helpful:', error);
      toast.error('Failed to update helpful vote');
    }
  };

  const handleVendorResponse = async (reviewId) => {
    if (!vendorResponse.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: vendorResponse }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Response submitted successfully!');
        setRespondingTo(null);
        setVendorResponse('');
        fetchReviews();
      } else {
        toast.error(data.error || 'Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    }
  };

  const renderStars = (count, interactive = false, size = 'md') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    const displayRating = interactive ? hoverRating || rating : count;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= displayRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {stats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="mt-2">{renderStars(Math.round(stats.averageRating))}</div>
              <p className="text-sm text-gray-600 mt-2">
                {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingDistribution[star] || 0;
                const percentage =
                  stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-600 w-8">{star}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write Review Button */}
          {orderId && (
            <div className="mt-6 pt-6 border-t">
              <Button
                onClick={() => setWriteReviewOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Customer Reviews ({stats?.totalReviews || 0})
        </h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600">
            Be the first to share your experience with this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-semibold">
                      {review.user.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.user.displayName}
                    </p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating, false, 'sm')}
                      {review.isVerifiedPurchase && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Review Content */}
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                {review.comment}
              </p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`Review ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleHelpful(review.id)}
                  className="text-gray-600 hover:text-emerald-600"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Helpful ({review.helpfulCount})
                </Button>

                {/* Vendor Response Button */}
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRespondingTo(review.id)}
                    className="text-gray-600 hover:text-emerald-600"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                )}
              </div>

              {/* Vendor Response */}
              {review.vendorResponse && (
                <div className="mt-4 ml-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-emerald-600">Vendor Response</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(review.vendorRespondedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.vendorResponse}</p>
                </div>
              )}

              {/* Response Form */}
              {respondingTo === review.id && (
                <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                  <Textarea
                    placeholder="Write your response..."
                    value={vendorResponse}
                    onChange={(e) => setVendorResponse(e.target.value)}
                    rows={3}
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVendorResponse(review.id)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Submit Response
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRespondingTo(null);
                        setVendorResponse('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Write Review Dialog */}
      <Dialog open={writeReviewOpen} onOpenChange={setWriteReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this product
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Rating *
              </label>
              {renderStars(rating, true)}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Review *
              </label>
              <Textarea
                placeholder="Tell us about your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWriteReviewOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
