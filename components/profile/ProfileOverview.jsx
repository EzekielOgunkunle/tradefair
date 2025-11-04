'use client';

import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Star,
  MapPin,
  Bell,
  DollarSign,
  Package,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ProfileOverview({ userData }) {
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const currency = '$';

  const stats = [
    {
      title: 'Total Orders',
      value: userData.stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Spent',
      value: `${currency}${(userData.stats.totalSpent / 100).toLocaleString('en-NG')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Reviews Written',
      value: userData.stats.totalReviews,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Saved Addresses',
      value: userData.stats.savedAddresses,
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const getStatusBadge = (status) => {
    const config = {
      PAID: { color: 'bg-blue-100 text-blue-800', label: 'Paid' },
      PROCESSING: { color: 'bg-yellow-100 text-yellow-800', label: 'Processing' },
      SHIPPED: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      DELIVERED: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      REFUNDED: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
    };
    return config[status] || config.PAID;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vendor Info (if applicable) */}
      {userData.vendor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Vendor Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Business Name</p>
              <p className="font-medium text-gray-900">
                {userData.vendor.businessName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge
                variant={
                  userData.vendor.status === 'APPROVED' ? 'default' : 'secondary'
                }
              >
                {userData.vendor.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="font-medium text-gray-900">
                {userData.vendor.rating.toFixed(1)} ⭐
              </p>
            </div>
          </div>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Go to Vendor Dashboard
            <TrendingUp className="h-4 w-4" />
          </Link>
        </motion.div>
      )}

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Link
            href="/orders"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View All
          </Link>
        </div>

        {userData.recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
            <Link
              href="/products"
              className="inline-block mt-3 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {userData.recentOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Order #{order.id.substring(0, 8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 mb-1">
                      {currency}
                      {(order.totalAmountCents / 100).toLocaleString('en-NG')}
                    </p>
                    <Badge className={statusBadge.color}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Notifications */}
      {userData.stats.unreadNotifications > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-emerald-600" />
            <div className="flex-1">
              <p className="font-medium text-emerald-900">
                You have {userData.stats.unreadNotifications} unread notification
                {userData.stats.unreadNotifications !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-emerald-700">
                Check your notifications to stay updated
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
