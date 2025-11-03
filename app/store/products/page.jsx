'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Package, Plus, Search, Edit, Trash2, Eye, EyeOff, 
  Loader2, TrendingUp, TrendingDown, AlertCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { showSuccess, showError } from '@/lib/toast-utils'
import Image from 'next/image'
import Link from 'next/link'

export default function VendorProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/vendor/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      showError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/vendor/products/${selectedProduct.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product')
      }

      showSuccess('Product deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedProduct(null)
      fetchProducts() // Refresh products
    } catch (error) {
      console.error('Failed to delete product:', error)
      showError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (product) => {
    try {
      const response = await fetch(`/api/vendor/products/${product.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.isActive })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product status')
      }

      showSuccess(`Product ${!product.isActive ? 'activated' : 'deactivated'} successfully`)
      fetchProducts() // Refresh products
    } catch (error) {
      console.error('Failed to toggle product status:', error)
      showError(error.message)
    }
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    lowStock: products.filter(p => p.inventory < 10).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Products</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your product inventory</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/store/add-product')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Inactive</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 mt-1">{stats.inactive}</p>
              </div>
              <TrendingDown className="w-12 h-12 text-gray-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.lowStock}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-amber-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No products found' : 'No products yet'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery ? 'Try a different search term' : 'Start by adding your first product'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push('/store/add-product')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {!product.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg">
                        Inactive
                      </Badge>
                    </div>
                  )}
                  {product.inventory < 10 && product.isActive && (
                    <Badge className="absolute top-2 right-2 bg-amber-500 text-white">
                      Low Stock: {product.inventory}
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₦{(product.priceCents / 100).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stock: {product.inventory}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="text-sm">★</span>
                        <span className="font-medium">{product.averageRating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.reviewCount} reviews
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3 flex-wrap">
                    {product.categories.slice(0, 2).map((category, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/store/manage-product?id=${product.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(product)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {product.isActive ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProduct(product)
                        setDeleteDialogOpen(true)
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setSelectedProduct(null)
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
