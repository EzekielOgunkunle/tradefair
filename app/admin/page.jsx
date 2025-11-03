'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  Award,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const currency = '₦';

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        toast.error(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatCurrency = (cents) => {
    return `${currency}${(cents / 100).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-NG');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  const { overview, usersByRole, ordersByStatus, topVendors, chartData } =
    analytics;

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(overview.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: parseFloat(overview.orderGrowth),
    },
    {
      title: 'Total Orders',
      value: formatNumber(overview.totalOrders),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: parseFloat(overview.orderGrowth),
    },
    {
      title: 'Total Users',
      value: formatNumber(overview.totalUsers),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Vendors',
      value: formatNumber(overview.approvedVendors),
      icon: Store,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtitle: `${overview.pendingVendors} pending`,
    },
    {
      title: 'Total Products',
      value: formatNumber(overview.totalProducts),
      icon: Package,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      subtitle: `${overview.activeProducts} active`,
    },
  ];

  // Pie chart colors
  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  // Format order status for display
  const formatOrderStatus = (status) => {
    return status
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-6 mb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Platform metrics and performance overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                )}
                {stat.trend !== undefined && (
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {Math.abs(stat.trend)}% vs last week
                    </span>
                  </div>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders & Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Orders & Revenue (Last 30 Days)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'revenue') {
                    return [formatCurrency(value), 'Revenue'];
                  }
                  return [value, 'Orders'];
                }}
                labelFormatter={(date) => {
                  return new Date(date).toLocaleDateString('en-NG', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Orders by Status
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) =>
                  `${formatOrderStatus(status)} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {ordersByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  value,
                  formatOrderStatus(props.payload.status),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Users by Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Users by Role
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersByRole}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Vendors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Vendors
            </h3>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {topVendors.slice(0, 5).map((vendor, index) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                      index === 0
                        ? 'bg-yellow-500'
                        : index === 1
                        ? 'bg-gray-400'
                        : index === 2
                        ? 'bg-orange-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {vendor.businessName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{vendor.totalOrders} orders</span>
                      <span>•</span>
                      <span>{vendor.totalProducts} products</span>
                      <span>•</span>
                      <span>{vendor.rating.toFixed(1)} ⭐</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(vendor.totalRevenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg p-6 text-white"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8" />
            <div>
              <p className="text-emerald-100 text-sm">Approved Vendors</p>
              <p className="text-2xl font-bold">
                {formatNumber(overview.approvedVendors)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8" />
            <div>
              <p className="text-emerald-100 text-sm">Pending Approval</p>
              <p className="text-2xl font-bold">
                {formatNumber(overview.pendingVendors)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8" />
            <div>
              <p className="text-emerald-100 text-sm">Active Products</p>
              <p className="text-2xl font-bold">
                {formatNumber(overview.activeProducts)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8" />
            <div>
              <p className="text-emerald-100 text-sm">Total Vendors</p>
              <p className="text-2xl font-bold">
                {formatNumber(overview.totalVendors)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
