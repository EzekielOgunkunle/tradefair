'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ActivityTracker({ listingId, activityType, metadata = null }) {
  const { user } = useUser();

  useEffect(() => {
    // Track activity when component mounts
    const trackActivity = async () => {
      try {
        await fetch('/api/activity/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId,
            activityType,
            metadata,
          }),
        });
      } catch (error) {
        console.error('Error tracking activity:', error);
      }
    };

    // Only track if listingId is provided
    if (listingId) {
      trackActivity();
    }
  }, [listingId, activityType, metadata]);

  return null; // This component doesn't render anything
}
