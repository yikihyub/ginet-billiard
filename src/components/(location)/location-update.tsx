'use client';

import { useEffect } from 'react';

interface LocationUpdaterProps {
  userId: number;
}

export default function LocationUpdater({ userId }: LocationUpdaterProps) {
  const updateLocation = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch('/api/member/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          latitude,
          longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  useEffect(() => {
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [userId]);

  return null;
}
