'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            {isLast ? (
              <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  href={item.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}
