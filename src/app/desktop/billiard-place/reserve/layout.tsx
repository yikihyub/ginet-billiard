import React from 'react';
import { LocationProvider } from './_components/context/location-context';
import KakaoMap from './_components/map/kakaomap';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocationProvider>
      <article className="flex h-screen w-full">
        <>{children}</>
        <div className="w-full">
          <KakaoMap />
        </div>
      </article>
    </LocationProvider>
  );
}
