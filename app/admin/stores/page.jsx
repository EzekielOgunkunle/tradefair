'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  ShoppingCart,
  TrendingUp,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVendors = async (status = null) => {
    try {
      setLoading(true);
      const url =
        status && status !== 'ALL'
          ? `/api/admin/vendors?status=${status}`
          : '/api/admin/vendors';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setVendors(data.vendors);
      } else {
        toast.error(data.error || 'Failed to fetch vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(statusFilter);
  }, [statusFilter]);

  const getStatusBadge = (status) => {
    const config = {
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
      },
      APPROVED: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2,
      },
      REJECTED: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
      },
    };

    const { color, icon: Icon } = config[status] || config.PENDING;

    return (
      <Badge className={`${color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: vendors.length,
    approved: vendors.filter((v) => v.status === 'APPROVED').length,
    pending: vendors.filter((v) => v.status === 'PENDING').length,
    rejected: vendors.filter((v) => v.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
        <p className="text-gray-600 mt-2">
          Manage and monitor all vendors on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vendors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <Store className="h-12 w-12 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {stats.approved}
              </p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <Clock className="h-12 w-12 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {stats.rejected}
              </p>
            </div>
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by business name, owner, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Vendors</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Vendor List */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Vendors Found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'No vendors match the selected criteria'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Vendor Info */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Store className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {vendor.businessName}
                        </h3>
                        {getStatusBadge(vendor.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {formatDate(vendor.createdAt)}
                        </div>
                        {vendor.approvedAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Approved {formatDate(vendor.approvedAt)}
                          </div>
                        )}
                        {vendor.rejectedAt && (
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            Rejected {formatDate(vendor.rejectedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Products</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {vendor._count.listings}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {vendor._count.orders}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {vendor.rating.toFixed(1)} ⭐
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium text-gray-900">
                          {vendor.user.displayName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a
                          href={`mailto:${vendor.user.email}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {vendor.user.email}
                        </a>
                      </div>
                      {vendor.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">
                            {vendor.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span className="font-medium text-gray-900">
                          {vendor.businessAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {vendor.status === 'REJECTED' && vendor.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-red-900 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-700">
                        {vendor.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
