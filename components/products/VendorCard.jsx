'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Store, Star, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function VendorCard({ vendor }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
      <div className="flex items-start gap-6">
        {/* Vendor Avatar */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-amber-100 dark:bg-amber-900/30 flex-shrink-0 flex items-center justify-center">
          {vendor.user.avatarUrl ? (
            <Image
              src={vendor.user.avatarUrl}
              alt={vendor.businessName}
              fill
              className="object-cover"
            />
          ) : (
            <Store className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          )}
        </div>

        {/* Vendor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {vendor.businessName}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {vendor.rating.toFixed(1)}
                  </span>
                </div>
                <Badge
                  variant={vendor.status === 'APPROVED' ? 'default' : 'secondary'}
                  className={
                    vendor.status === 'APPROVED'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : ''
                  }
                >
                  {vendor.status === 'APPROVED' ? 'Verified' : vendor.status}
                </Badge>
              </div>
            </div>

            <Link href={`/vendor/${vendor.id}`}>
              <Button variant="outline" className="whitespace-nowrap">
                View Store
              </Button>
            </Link>
          </div>

          {/* Business Description */}
          {vendor.businessDescription && (
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {vendor.businessDescription}
            </p>
          )}

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            {vendor.businessAddress && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{vendor.businessAddress}</span>
              </div>
            )}
            {vendor.phoneNumber && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{vendor.phoneNumber}</span>
              </div>
            )}
            {vendor.contactEmail && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{vendor.contactEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
