/**
 * TradeFair Toast Utilities
 * Reusable toast notification functions using Sonner
 */

import { toast } from 'sonner';

/**
 * Display a success toast notification
 * @param {string} message - The success message to display
 * @param {Object} options - Additional sonner toast options
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    ...options,
  });
};

/**
 * Display an error toast notification
 * @param {string} message - The error message to display
 * @param {Object} options - Additional sonner toast options
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 5000,
    ...options,
  });
};

/**
 * Display an info toast notification
 * @param {string} message - The info message to display
 * @param {Object} options - Additional sonner toast options
 */
export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    duration: 4000,
    ...options,
  });
};

/**
 * Display a warning toast notification
 * @param {string} message - The warning message to display
 * @param {Object} options - Additional sonner toast options
 */
export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    duration: 4500,
    ...options,
  });
};

/**
 * Display a loading toast notification
 * @param {string} message - The loading message to display
 * @param {Object} options - Additional sonner toast options
 * @returns {string|number} Toast ID for later updates
 */
export const showLoading = (message, options = {}) => {
  return toast.loading(message, options);
};

/**
 * Display a promise toast with loading, success, and error states
 * @param {Promise} promise - The promise to track
 * @param {Object} messages - Messages for loading, success, and error states
 * @param {Object} options - Additional sonner toast options
 */
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Processing...',
    success: messages.success || 'Success!',
    error: messages.error || 'An error occurred',
    ...options,
  });
};

/**
 * Display a toast with a custom action button
 * @param {string} message - The message to display
 * @param {Object} action - Action button configuration { label, onClick }
 * @param {Object} options - Additional sonner toast options
 */
export const showWithAction = (message, action, options = {}) => {
  return toast(message, {
    action: {
      label: action.label,
      onClick: action.onClick,
    },
    duration: 5000,
    ...options,
  });
};

/**
 * Display a toast with a cancel button
 * @param {string} message - The message to display
 * @param {Object} cancel - Cancel button configuration { label, onClick }
 * @param {Object} options - Additional sonner toast options
 */
export const showWithCancel = (message, cancel, options = {}) => {
  return toast(message, {
    cancel: {
      label: cancel.label || 'Cancel',
      onClick: cancel.onClick,
    },
    duration: 6000,
    ...options,
  });
};

/**
 * Dismiss a specific toast by ID
 * @param {string|number} toastId - The ID of the toast to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all active toasts
 */
export const dismissAll = () => {
  toast.dismiss();
};

/**
 * Update an existing toast
 * @param {string|number} toastId - The ID of the toast to update
 * @param {Object} options - New toast options
 */
export const updateToast = (toastId, options) => {
  return toast(options.message || 'Updated', {
    id: toastId,
    ...options,
  });
};

// E-commerce specific utilities

/**
 * Show a product added to cart notification
 * @param {string} productName - Name of the product
 */
export const notifyAddedToCart = (productName) => {
  showSuccess(`${productName} added to cart`, {
    description: 'View cart to complete your purchase',
  });
};

/**
 * Show an order placed notification
 * @param {string} orderNumber - The order number
 */
export const notifyOrderPlaced = (orderNumber) => {
  showSuccess('Order placed successfully!', {
    description: `Order #${orderNumber} has been confirmed`,
    duration: 6000,
  });
};

/**
 * Show a vendor approval notification
 * @param {string} vendorName - Name of the vendor
 */
export const notifyVendorApproved = (vendorName) => {
  showSuccess(`${vendorName} has been approved`, {
    description: 'They can now start selling on TradeFair',
  });
};

/**
 * Show a listing updated notification
 */
export const notifyListingUpdated = () => {
  showSuccess('Listing updated successfully', {
    description: 'Your changes are now live',
  });
};

/**
 * Show a payment processing notification
 * @param {Promise} paymentPromise - Payment processing promise
 */
export const notifyPaymentProcessing = (paymentPromise) => {
  return showPromise(paymentPromise, {
    loading: 'Processing payment...',
    success: 'Payment successful!',
    error: 'Payment failed. Please try again.',
  });
};

/**
 * Show a file upload notification
 * @param {Promise} uploadPromise - File upload promise
 * @param {string} fileName - Name of the file being uploaded
 */
export const notifyFileUpload = (uploadPromise, fileName) => {
  return showPromise(uploadPromise, {
    loading: `Uploading ${fileName}...`,
    success: `${fileName} uploaded successfully`,
    error: `Failed to upload ${fileName}`,
  });
};
