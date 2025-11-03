'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  MapPin,
  Settings,
  ShoppingBag,
  Bell,
  Heart,
  CreditCard,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileOverview from '@/components/profile/ProfileOverview';
import OrderHistory from '@/components/profile/OrderHistory';
import SavedAddresses from '@/components/profile/SavedAddresses';
import AccountSettings from '@/components/profile/AccountSettings';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user.imageUrl || '/placeholder-avatar.png'}
                alt={user.fullName || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-2">
                <User className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.fullName || 'User Profile'}
              </h1>
              <p className="text-gray-600 mt-1">{user.emailAddresses[0]?.emailAddress}</p>
              {userData && (
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <User className="h-3 w-3" />
                    {userData.role}
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white border border-gray-200 p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProfileOverview userData={userData} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>

          <TabsContent value="addresses">
            <SavedAddresses />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettings userData={userData} onUpdate={fetchUserData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
