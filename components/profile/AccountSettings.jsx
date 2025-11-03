'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function AccountSettings({ userData, onUpdate }) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        if (onUpdate) onUpdate();
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Information
          </h3>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(userData.displayName);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            {isEditing ? (
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{userData.displayName}</p>
            )}
          </div>

          <div>
            <Label>Email Address</Label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-900 font-medium">{userData.email}</p>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Verified
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email is managed by your authentication provider
            </p>
          </div>

          <div>
            <Label>User ID</Label>
            <p className="mt-1 text-sm text-gray-600 font-mono">
              {userData.id}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Account Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Account Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Account Role</p>
              <Badge className="mt-1 bg-emerald-100 text-emerald-700">
                {userData.role}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="mt-1 font-medium text-gray-900">
                {new Date(userData.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Email Notifications</p>
              <p className="mt-1 font-medium text-gray-900">Enabled</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Profile Visibility</p>
              <p className="mt-1 font-medium text-gray-900">Public</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vendor Information */}
      {userData.vendor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-emerald-50 border border-emerald-200 rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-emerald-900">
              Vendor Account
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-emerald-700">Business Name</p>
              <p className="font-medium text-emerald-900">
                {userData.vendor.businessName}
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Vendor Status</p>
              <Badge
                variant={
                  userData.vendor.status === 'APPROVED' ? 'default' : 'secondary'
                }
              >
                {userData.vendor.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Business Rating</p>
              <p className="font-medium text-emerald-900">
                {userData.vendor.rating.toFixed(1)} ⭐
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-red-200 p-6"
      >
        <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Account management actions are handled through your authentication provider.
        </p>
        <Button
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
          onClick={() => user?.delete()}
        >
          Delete Account
        </Button>
      </motion.div>
    </div>
  );
}
