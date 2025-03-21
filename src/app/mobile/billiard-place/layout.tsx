import React, { ReactNode } from 'react';

import ThreeballTab from './_components/tab/threeball-tab';
import { LocationProvider } from './reserve/_components/context/location-context';

interface layoutProps {
  children: ReactNode;
}

export default function ThreeBaalLayout({ children }: layoutProps) {
  return (
    <LocationProvider>
      <ThreeballTab />
      {children}
    </LocationProvider>
  );
}
