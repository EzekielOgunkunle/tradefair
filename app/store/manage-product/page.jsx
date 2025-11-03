'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { showSuccess, showError } from '@/lib/toast-utils'
import Image from 'next/image'

const CATEGORIES = [
  'Electronics', 'Fashion & Clothing', 'Home & Kitchen', 'Beauty & Health',
  'Sports & Outdoors', 'Books & Media', 'Toys & Games', 'Food & Beverages',
  'Automotive', 'Arts & Crafts', 'Pet Supplies', 'Office Supplies', 'Others'
]

export default function EditProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  
  const [loading, setLoading] = useState(false)
  const [fetchingProduct, setFetchingProduct] = useState(true)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCents: '',
    inventory: '',
    categories: [],
    categoryInput: ''
  })

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}/details`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      const data = await response.json()
      const product = data.product

      setFormData({
        title: product.title,
        description: product.description,
        priceCents: product.priceCents,
        inventory: product.inventory,
        categories: product.categories,
        categoryInput: ''
      })
      setExistingImages(product.images || [])
    } catch (error) {
      console.error('Fetch product error:', error)
      showError('Failed to load product')
      router.push('/store/products')
    } finally {
      setFetchingProduct(false)
    }
  }

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files)
    const totalImages = existingImages.length + newImages.length + files.length
    
    if (totalImages > 4) {
      showError('Maximum 4 images allowed')
      return
    }

    setNewImages([...newImages, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setNewImagePreviews([...newImagePreviews, ...newPreviews])
  }

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImages(newImages.filter((_, i) => i !== index))
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index))
  }

  const handleAddCategory = () => {
    const category = formData.categoryInput.trim()
    if (category && !formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
        categoryInput: ''
      })
    }
  }

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(cat => cat !== categoryToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (existingImages.length + newImages.length === 0) {
      showError('Please add at least one product image')
      return
    }

    if (formData.categories.length === 0) {
      showError('Please add at least one category')
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('priceCents', parseInt(formData.priceCents))
      data.append('inventory', parseInt(formData.inventory))
      data.append('categories', JSON.stringify(formData.categories))
      data.append('existingImages', JSON.stringify(existingImages))
      
      newImages.forEach((image, index) => {
        data.append(`image${index}`, image)
      })

      const response = await fetch(`/api/vendor/products/${productId}/update`, {
        method: 'PUT',
        body: data
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product')
      }

      showSuccess('Product updated successfully!')
      router.push('/store/products')
    } catch (error) {
      console.error('Update product error:', error)
      showError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchingProduct) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/store/products')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Update your product details</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6"
        >
          {/* Product Images */}
          <div>
            <Label>Product Images (Max 4)</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Upload clear images of your product. First image will be the main image.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Existing Images */}
              {existingImages.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group">
                  <Image
                    src={imageUrl}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <Badge className="absolute bottom-2 left-2 bg-emerald-600">
                      Main
                    </Badge>
                  )}
                </div>
              ))}

              {/* New Images */}
              {newImagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group">
                  <Image
                    src={preview}
                    alt={`New ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <Badge className="absolute bottom-2 left-2 bg-blue-600">
                    New
                  </Badge>
                </div>
              ))}
              
              {existingImages.length + newImages.length < 4 && (
                <label className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Product Title */}
          <div>
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Wireless Bluetooth Headphones"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product in detail..."
              rows={6}
              required
            />
          </div>

          {/* Price and Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price">Price (₦) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.priceCents ? formData.priceCents / 100 : ''}
                onChange={(e) => setFormData({ ...formData, priceCents: Math.round(parseFloat(e.target.value || 0) * 100) })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enter price in Naira (e.g., 15000 for ₦15,000)
              </p>
            </div>

            <div>
              <Label htmlFor="inventory">Stock Quantity *</Label>
              <Input
                id="inventory"
                type="number"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                placeholder="0"
                min="0"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Available inventory count
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <Label>Categories *</Label>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={formData.categoryInput}
                onChange={(e) => setFormData({ ...formData, categoryInput: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                placeholder="Type a category and press Enter"
                list="categories-list"
              />
              <Button type="button" onClick={handleAddCategory} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <datalist id="categories-list">
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>

            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {category}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/store/products')}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Product...
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
