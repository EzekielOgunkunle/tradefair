'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, Loader2, ShoppingBag, Clock, CheckCircle2, XCircle, Truck, Eye, XOctagon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { showSuccess, showError } from '@/lib/toast-utils'
import Link from 'next/link'
import Image from 'next/image'

export default function OrdersPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders()
    }
  }, [isLoaded, user])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/my-orders')
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      showError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancellationReason.trim()) {
      showError('Please provide a cancellation reason')
      return
    }

    setCancelling(true)
    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          reason: cancellationReason
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel order')
      }

      showSuccess('Order cancelled successfully')
      setCancelDialogOpen(false)
      setCancellationReason('')
      setSelectedOrder(null)
      fetchOrders() // Refresh orders
    } catch (error) {
      console.error('Failed to cancel order:', error)
      showError(error.message)
    } finally {
      setCancelling(false)
    }
  }

  const canCancelOrder = (order) => {
    return ['PENDING', 'PAID', 'PROCESSING'].includes(order.status)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle2 className="w-4 h-4" />
      case 'PROCESSING':
        return <Clock className="w-4 h-4" />
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />
      case 'DELIVERED':
        return <CheckCircle2 className="w-4 h-4" />
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
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

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
              <p className="text-emerald-50 mt-1">Track and manage your purchases</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders yet
            </p>
            <Link href="/products">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium">
                Start Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                      <p className="font-mono font-medium text-gray-900 dark:text-white">
                        {order.id.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₦{(order.totalAmountCents / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          {item.listing?.images?.[0] && (
                            <Image
                              src={item.listing.images[0]}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × ₦{(item.priceCents / 100).toLocaleString()}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ₦{((item.priceCents * item.quantity) / 100).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Shipping Address
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.street}, {order.city}, {order.state} {order.postalCode}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 flex-wrap">
                    <Button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      variant="outline"
                      className="flex-1 md:flex-none"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {canCancelOrder(order) && (
                      <Button
                        onClick={() => {
                          setSelectedOrder(order)
                          setCancelDialogOpen(true)
                        }}
                        variant="destructive"
                        className="flex-1 md:flex-none"
                      >
                        <XOctagon className="w-4 h-4 mr-2" />
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for cancellation</Label>
              <Textarea
                id="reason"
                placeholder="Please tell us why you're cancelling this order..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false)
                setCancellationReason('')
              }}
              disabled={cancelling}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={cancelling || !cancellationReason.trim()}
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Order'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
