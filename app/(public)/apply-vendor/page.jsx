'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Store, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { showError, showSuccess } from '@/lib/toast-utils'

export default function ApplyVendorPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    phoneNumber: '',
    address: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isLoaded || !user) {
      showError('Please sign in to apply as a vendor')
      return
    }

    if (!formData.businessName || !formData.businessDescription || !formData.phoneNumber) {
      showError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/vendors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit application')
      }

      showSuccess('Application submitted successfully! Admin will review it shortly.')
      setTimeout(() => router.push('/'), 2000)
    } catch (error) {
      console.error('Vendor application error:', error)
      showError(error.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to apply as a vendor
          </p>
          <Button onClick={() => router.push('/sign-in')} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Store className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Become a Vendor</h1>
            <p className="text-emerald-50 text-lg">
              Join TradeFair and start selling your products to customers across Nigeria
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Vendor Application
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="e.g., African Fabrics"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="businessDescription">Business Description *</Label>
              <Textarea
                id="businessDescription"
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleInputChange}
                placeholder="Tell us about your business, products you sell, and your target market..."
                rows={5}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+234 XXX XXX XXXX"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Your business location"
                className="mt-1"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                    What happens next?
                  </p>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Your application will be reviewed by our admin team</li>
                    <li>• You'll receive an email notification about your status</li>
                    <li>• Once approved, you can start listing your products</li>
                    <li>• Manage orders and inventory from your vendor dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          {[
            { title: 'Easy Setup', desc: 'Start selling in minutes with our simple dashboard' },
            { title: 'Secure Payments', desc: 'Get paid directly via Paystack integration' },
            { title: 'Wide Reach', desc: 'Access customers across Nigeria' }
          ].map((benefit, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {benefit.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
