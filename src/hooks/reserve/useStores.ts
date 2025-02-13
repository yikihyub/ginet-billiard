'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/types/(reserve)';

export function useStores() {
  const [rooms, setRooms] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/store/getstore', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

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
  }, []);

  return { rooms, isLoading, error };
}
