'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MapBounds, LocationData, LocationContextType } from '../../../_types';

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [location, setLocation] = useState<LocationData>({
    lat: 37.5665,
    lng: 126.978,
    level: 5,
  });
  const [bounds, setBounds] = useState<MapBounds | null>(null); // bounds 상태 추가

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await fetch(
          `/api/member/getlocation?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const locationData = await response.json();

        if (locationData) {
          setLocation({
            lat: locationData.latitude,
            lng: locationData.longitude,
            level: 5,
          });
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    if (userId) {
      fetchUserLocation();
    }
  }, [userId]);

  const handleSetLocation = (lat: number, lng: number, level: number) => {
    setLocation({ lat, lng, level });
  };

  const handleSetBounds = (newBounds: MapBounds) => {
    setBounds(newBounds);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        bounds,
        userId,
        setLocation: handleSetLocation,
        setBounds: handleSetBounds,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context)
    throw new Error('useLocation must be used within LocationProvider');
  return context;
};
