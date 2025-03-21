'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/types/(reserve)';
import { useLocation } from '@/app/desktop/billiard-place/reserve/_components/context/location-context';

interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export function useStores(bounds?: MapBounds) {
  const { location } = useLocation();
  const [rooms, setRooms] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);

        let url = '/api/store/getstore';

        if (bounds) {
          url += `?${new URLSearchParams({
            swLat: bounds.swLat.toString(),
            swLng: bounds.swLng.toString(),
            neLat: bounds.neLat.toString(),
            neLng: bounds.neLng.toString(),
          })}`;
        } else if (location) {
          url += `?${new URLSearchParams({
            lat: location.lat.toString(),
            lng: location.lng.toString(),
          })}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch store data');
        }

        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('📌 API 요청 중 오류 발생:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [bounds, location]);

  return { rooms, isLoading, error };
}
