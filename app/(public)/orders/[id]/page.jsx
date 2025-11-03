'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle2, Truck, XCircle, Phone, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { showError } from '@/lib/toast-utils'
import Image from 'next/image'
import Link from 'next/link'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails()
    }
  }, [params.id])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Failed to fetch order:', error)
      showError('Failed to load order details')
      router.push('/orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle2 className="w-5 h-5" />
      case 'PROCESSING':
        return <Clock className="w-5 h-5" />
      case 'SHIPPED':
        return <Truck className="w-5 h-5" />
      case 'DELIVERED':
        return <CheckCircle2 className="w-5 h-5" />
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusSteps = () => {
    const steps = [
      { key: 'PAID', label: 'Order Placed', icon: CheckCircle2 },
      { key: 'PROCESSING', label: 'Processing', icon: Clock },
      { key: 'SHIPPED', label: 'Shipped', icon: Truck },
      { key: 'DELIVERED', label: 'Delivered', icon: Package }
    ]

    const statusOrder = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    const currentIndex = statusOrder.indexOf(order?.status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return null
  }

  const steps = getStatusSteps()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/orders')}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Order Details</h1>
              <p className="text-emerald-50 mt-1">
                Order #{order.id.substring(0, 8).toUpperCase()}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} text-lg px-4 py-2`}>
              <span className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Progress
                </h2>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{
                        width: `${(steps.filter(s => s.completed).length - 1) / (steps.length - 1) * 100}%`
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {steps.map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            step.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                          }`}
                        >
                          <step.icon className="w-5 h-5" />
                        </div>
                        <p
                          className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                            step.completed
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.listingId}`}
                    className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {item.listing?.images?.[0] && (
                        <Image
                          src={item.listing.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Qty: {item.quantity} × ₦{(item.priceCents / 100).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₦{((item.priceCents * item.quantity) / 100).toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Shipping Address
                </h2>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <p>{order.street}</p>
                <p>
                  {order.city}, {order.state} {order.postalCode}
                </p>
                <p>{order.country}</p>
              </div>
            </motion.div>

            {/* Vendor Info */}
            {order.vendor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Vendor Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Business Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.vendor.businessName}
                    </p>
                  </div>
                  {order.vendor.contactEmail && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{order.vendor.contactEmail}</span>
                    </div>
                  )}
                  {order.vendor.phoneNumber && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>{order.vendor.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-4"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {order.paystackReference && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Ref</p>
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-white break-all">
                      {order.paystackReference}
                    </p>
                  </div>
                )}

                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                    <span>Subtotal</span>
                    <span>₦{(order.totalAmountCents / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ₦{(order.totalAmountCents / 100).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment Method</span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.paymentMethod || 'Paystack'}
                  </p>
                </div>

                {order.status === 'DELIVERED' && (
                  <Button
                    onClick={() => router.push(`/product/${order.items[0]?.listingId}?review=true`)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Write a Review
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
