'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col justify-center space-y-6 px-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Welcome back to{' '}
              <span className="text-emerald-600 dark:text-emerald-400">TradeFair</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your trusted African marketplace connecting buyers with verified vendors
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Verified Vendors</h3>
                <p className="text-gray-600 dark:text-gray-400">Shop with confidence from trusted sellers</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Secure Payments</h3>
                <p className="text-gray-600 dark:text-gray-400">Safe transactions with Paystack integration</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Fast Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400">Quick and reliable shipping across Africa</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Sign in form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="text-center space-y-2 lg:hidden">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign in to <span className="text-emerald-600 dark:text-emerald-400">TradeFair</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Please sign in to continue</p>
          </div>

          <div className="w-full max-w-md">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700",
                  headerTitle: "text-2xl font-bold text-gray-900 dark:text-white",
                  headerSubtitle: "text-gray-600 dark:text-gray-400",
                  socialButtonsBlockButton: "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
                  formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg",
                  footerActionLink: "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300",
                  formFieldInput: "border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg",
                  formFieldLabel: "text-gray-700 dark:text-gray-300",
                  identityPreviewText: "text-gray-700 dark:text-gray-300",
                  dividerLine: "bg-gray-300 dark:bg-gray-600",
                  dividerText: "text-gray-500 dark:text-gray-400",
                },
              }}
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium">
                Sign up
              </Link>
            </p>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
