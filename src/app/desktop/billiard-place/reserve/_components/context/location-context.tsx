'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

interface LocationContextType {
  location: { lat: number; lng: number };
  bounds: MapBounds | null; // bounds 정보 추가
  setLocation: (lat: number, lng: number, level: number) => void;
  setBounds: (bounds: MapBounds) => void;
  userId?: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [location, setLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
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

  const handleSetLocation = (lat: number, lng: number) => {
    setLocation({ lat, lng });
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
