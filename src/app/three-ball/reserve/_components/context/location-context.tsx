'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  location: { lat: number; lng: number };
  setLocation: (lat: number, lng: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });

  const handleSetLocation = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  return (
    <LocationContext.Provider
      value={{ location, setLocation: handleSetLocation }}
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
