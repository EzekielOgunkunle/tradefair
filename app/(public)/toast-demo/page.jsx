'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  showSuccess, 
  showError, 
  showInfo, 
  showWarning,
  showWithAction,
  showPromise,
  notifyAddedToCart,
  notifyOrderPlaced,
  notifyVendorApproved
} from '@/lib/toast-utils'

const ToastDemo = () => {
  
  // Simulate async operation
  const simulatePayment = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.3 ? resolve('Payment successful') : reject(new Error('Payment failed'))
      }, 2000)
    })
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          TradeFair Toast Notifications
        </h1>
        <p className="text-slate-600">
          Demo of Sonner toast system with TradeFair design tokens
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Toasts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Basic Notifications</CardTitle>
            <CardDescription>Simple toast messages for different states</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              onClick={() => showSuccess('Profile updated successfully!')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Success Toast
            </Button>
            <Button 
              onClick={() => showError('Failed to connect to server')}
              variant="destructive"
            >
              Error Toast
            </Button>
            <Button 
              onClick={() => showInfo('New features available in settings')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Info Toast
            </Button>
            <Button 
              onClick={() => showWarning('Your session expires in 5 minutes')}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Warning Toast
            </Button>
          </CardContent>
        </Card>

        {/* Interactive Toasts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Interactive Toasts</CardTitle>
            <CardDescription>Toasts with action and cancel buttons</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              onClick={() => showWithAction(
                'Item removed from cart',
                { 
                  label: 'Undo', 
                  onClick: () => showSuccess('Item restored!')
                }
              )}
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            >
              Toast with Action
            </Button>
          </CardContent>
        </Card>

        {/* Promise Toast */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Promise Toast</CardTitle>
            <CardDescription>Shows loading state and handles success/error</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              onClick={() => showPromise(
                simulatePayment(),
                {
                  loading: 'Processing payment...',
                  success: 'Payment successful!',
                  error: 'Payment failed. Please try again.'
                }
              )}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Simulate Payment
            </Button>
          </CardContent>
        </Card>

        {/* E-commerce Toasts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">
              E-commerce Notifications
              <Badge className="ml-2 bg-amber-500">TradeFair Specific</Badge>
            </CardTitle>
            <CardDescription>Pre-configured toasts for common marketplace actions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              onClick={() => notifyAddedToCart('iPhone 13 Pro')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Add to Cart
            </Button>
            <Button 
              onClick={() => notifyOrderPlaced('TF-' + Math.random().toString(36).substr(2, 9).toUpperCase())}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Place Order
            </Button>
            <Button 
              onClick={() => notifyVendorApproved('African Crafts Store')}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Approve Vendor
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Color Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-emerald-700">TradeFair Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-emerald-600 rounded-lg"></div>
              <p className="text-sm font-medium">Primary Emerald</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-amber-500 rounded-lg"></div>
              <p className="text-sm font-medium">Secondary Amber</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-teal-500 rounded-lg"></div>
              <p className="text-sm font-medium">Accent Teal</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-slate-900 rounded-lg"></div>
              <p className="text-sm font-medium">Text Slate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ToastDemo
