'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function VendorPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
      >
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Clock className="w-12 h-12 text-amber-600 dark:text-amber-400" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-transparent border-t-amber-600 dark:border-t-amber-400 rounded-full"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vendor Application Pending
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your vendor account is currently under review
            </p>
          </div>

          {/* Status Info */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Our team is reviewing your vendor application. This typically takes 1-2 business days.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Application submitted</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">Under review by admin</p>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-5 h-5 border-2 border-gray-400 dark:border-gray-500 rounded-full" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Approval & store access</p>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
                <span>You'll receive an email notification once your application is reviewed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
                <span>If approved, you'll get instant access to your vendor dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
                <span>You can then start listing products and managing your store</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition"
            >
              Contact Support
            </Link>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If you believe this is an error or have been waiting longer than expected, please contact our support team.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
