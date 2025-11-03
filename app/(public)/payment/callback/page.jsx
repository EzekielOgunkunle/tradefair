'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, Package, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { showSuccess, showError } from '@/lib/toast-utils'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, failed
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference')
      const trxref = searchParams.get('trxref')
      
      const transactionRef = reference || trxref

      if (!transactionRef) {
        setStatus('failed')
        showError('No transaction reference found')
        return
      }

      try {
        // Verify payment with backend
        const response = await fetch(`/api/payment/verify?reference=${transactionRef}`)
        
        if (!response.ok) {
          throw new Error('Failed to verify payment')
        }

        const data = await response.json()

        if (data.success && data.status === 'success') {
          // Update order status
          await updateOrderStatus(transactionRef, 'PAID')
          setStatus('success')
          setOrderDetails(data)
          showSuccess('Payment successful! Your order has been confirmed.')
        } else {
          setStatus('failed')
          showError('Payment verification failed')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
        showError(error.message || 'Failed to verify payment')
      }
    }

    verifyPayment()
  }, [searchParams])

  const updateOrderStatus = async (reference, status) => {
    try {
      await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, status })
      })
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we confirm your transaction...
          </p>
        </motion.div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            {orderDetails && (
              <div className="bg-slate-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="text-gray-500 dark:text-gray-400">Transaction Reference</p>
                    <p className="font-mono font-medium text-gray-900 dark:text-white">
                      {orderDetails.reference}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 dark:text-gray-400">Amount Paid</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ₦{(orderDetails.amount / 100).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/orders')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                View Orders
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A confirmation email has been sent to your registered email address.
                You can track your order status in the Orders section.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Failed status
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Unfortunately, we couldn't process your payment. Please try again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/checkout')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Try Again
            </Button>
            <Button
              onClick={() => router.push('/cart')}
              variant="outline"
            >
              Back to Cart
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If you continue to experience issues, please contact our support team.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
