import React from 'react';

import { LocationProvider } from './_components/context/location-context';
import { SearchProvider } from './_components/provider/search-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocationProvider>
      <SearchProvider>
        <div className="w-full overflow-hidden">
          <div>{children}</div>
        </div>
      </SearchProvider>
    </LocationProvider>
  );
}
