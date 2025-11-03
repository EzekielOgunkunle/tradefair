'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function ProductFilters({ categories, searchParams }) {
  const router = useRouter()
  const params = useSearchParams()
  
  const [priceRange, setPriceRange] = useState([
    Number(params.get('minPrice')) || 0,
    Number(params.get('maxPrice')) || 100000,
  ])

  const applyFilters = (newParams) => {
    const current = new URLSearchParams(params.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })
    
    // Reset to page 1 when filters change
    current.set('page', '1')
    
    router.push(`/products?${current.toString()}`)
  }

  const clearFilters = () => {
    router.push('/products')
  }

  const handleCategoryClick = (category) => {
    applyFilters({ category })
  }

  const handleSortChange = (sortBy) => {
    applyFilters({ sortBy })
  }

  const handlePriceApply = () => {
    applyFilters({
      minPrice: priceRange[0] > 0 ? priceRange[0] : '',
      maxPrice: priceRange[1] < 100000 ? priceRange[1] : '',
    })
  }

  const activeFiltersCount = [
    params.get('category'),
    params.get('minPrice'),
    params.get('maxPrice'),
    params.get('search'),
  ].filter(Boolean).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['sort', 'categories', 'price']} className="space-y-4">
        {/* Sort By */}
        <AccordionItem value="sort" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="font-medium text-gray-900 dark:text-white">Sort By</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Select onValueChange={handleSortChange} defaultValue={params.get('sortBy') || 'newest'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="font-medium text-gray-900 dark:text-white">Categories</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    params.get('category') === category
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="font-medium text-gray-900 dark:text-white">Price Range (₦)</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={100000}
              step={1000}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                placeholder="Min"
                className="flex-1"
              />
              <span className="text-gray-500 dark:text-gray-400">-</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                placeholder="Max"
                className="flex-1"
              />
            </div>
            <Button
              onClick={handlePriceApply}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Apply Price Filter
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {params.get('category') && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                onClick={() => applyFilters({ category: '' })}
              >
                {params.get('category')}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {params.get('search') && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                onClick={() => applyFilters({ search: '' })}
              >
                Search: {params.get('search')}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {(params.get('minPrice') || params.get('maxPrice')) && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                onClick={() => applyFilters({ minPrice: '', maxPrice: '' })}
              >
                ₦{params.get('minPrice') || 0} - ₦{params.get('maxPrice') || '100k+'}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
