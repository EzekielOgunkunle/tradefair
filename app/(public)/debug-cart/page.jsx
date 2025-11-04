'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, Trash2, ShoppingBag, CheckCircle } from 'lucide-react'

export default function DebugCartPage() {
  const router = useRouter()
  const [cartData, setCartData] = useState(null)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    loadCartData()
  }, [])

  const loadCartData = () => {
    const data = localStorage.getItem('tradefair_cart')
    if (data) {
      try {
        setCartData(JSON.parse(data))
      } catch (e) {
        setCartData({ error: 'Failed to parse cart data' })
      }
    } else {
      setCartData(null)
    }
  }

  const clearCart = () => {
    localStorage.removeItem('tradefair_cart')
    setCleared(true)
    setCartData(null)
    setTimeout(() => setCleared(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
            🛒 Cart Debugger
          </h1>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Problem Detected</p>
                <p className="text-sm text-blue-800 mt-1">
                  Your cart contains old product IDs from before the database was reseeded with 35 new products.
                </p>
              </div>
            </div>
          </div>

          {cleared && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-800 font-medium">
                Cart cleared successfully! Now add fresh products.
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Current Cart Contents:</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words">
                {cartData 
                  ? JSON.stringify(cartData, null, 2)
                  : '✓ Cart is empty'
                }
              </pre>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              onClick={clearCart}
              variant="destructive"
              size="lg"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear Cart (Fix Issue)
            </Button>
            
            <Button
              onClick={() => router.push('/products')}
              size="lg"
              className="flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Go Add Fresh Products
            </Button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Clear Cart" to remove old product IDs</li>
              <li>Click "Go Add Fresh Products" to visit products page</li>
              <li>Add products to cart from the products page</li>
              <li>Try checkout again - it should work perfectly! 🎉</li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Why this happened:</strong> When the database was reseeded with 35 new products, 
              all product IDs changed. Your cart still had the old IDs stored in localStorage, 
              causing "Product not found" errors during checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
