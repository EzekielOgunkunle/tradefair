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
  FileText,
  Building2,
  CreditCard,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function VendorApprovalPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/vendors/pending');
      const data = await response.json();

      if (data.success) {
        setVendors(data.vendors);
      } else {
        toast.error(data.error || 'Failed to fetch pending vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch pending vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/admin/vendors/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Vendor approved successfully! 🎉');
        // Remove from list
        setVendors(vendors.filter((v) => v.id !== vendorId));
      } else {
        toast.error(data.error || 'Failed to approve vendor');
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast.error('Failed to approve vendor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch('/api/admin/vendors/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: selectedVendor.id,
          reason: rejectionReason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Vendor application rejected');
        // Remove from list
        setVendors(vendors.filter((v) => v.id !== selectedVendor.id));
        setRejectDialogOpen(false);
        setRejectionReason('');
        setSelectedVendor(null);
      } else {
        toast.error(data.error || 'Failed to reject vendor');
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast.error('Failed to reject vendor');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = (vendor) => {
    setSelectedVendor(vendor);
    setRejectDialogOpen(true);
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Vendor Approvals</h1>
        <p className="text-gray-600 mt-2">
          Review and approve vendor applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {vendors.length}
              </p>
            </div>
            <Clock className="h-12 w-12 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      {/* Vendor List */}
      {vendors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            All Caught Up!
          </h3>
          <p className="text-gray-600">
            There are no pending vendor applications at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Vendor Info */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Store className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {vendor.businessName}
                        </h3>
                        <Badge variant="outline" className="bg-yellow-50">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Applied {formatDate(vendor.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Business Description */}
                  {vendor.businessDescription && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Business Description
                          </p>
                          <p className="text-sm text-gray-600">
                            {vendor.businessDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Owner Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium text-gray-900">
                          {vendor.user.displayName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Email:</span>
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
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">
                            {vendor.phoneNumber}
                          </span>
                        </div>
                      )}

                      {vendor.contactEmail && vendor.contactEmail !== vendor.user.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Business Email:</span>
                          <span className="font-medium text-gray-900">
                            {vendor.contactEmail}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Business Details */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <p className="font-medium text-gray-900">
                            {vendor.businessAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium text-gray-900">
                          {vendor.bankName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Account:</span>
                        <span className="font-medium text-gray-900">
                          {vendor.accountNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-medium text-gray-900">
                          {vendor.accountName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* KYC Documents */}
                  {vendor.kycDocuments && vendor.kycDocuments.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        KYC Documents ({vendor.kycDocuments.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.kycDocuments.map((doc, idx) => (
                          <a
                            key={idx}
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Document {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-3">
                  <Button
                    onClick={() => handleApprove(vendor.id)}
                    disabled={actionLoading}
                    className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => openRejectDialog(vendor)}
                    disabled={actionLoading}
                    variant="destructive"
                    className="flex-1 lg:flex-none"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vendor Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting{' '}
              <span className="font-semibold">
                {selectedVendor?.businessName}
              </span>
              's application. This will be sent to the vendor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Be clear and professional in your feedback.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason('');
                setSelectedVendor(null);
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !rejectionReason.trim()}
            >
              {actionLoading ? 'Rejecting...' : 'Reject Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
