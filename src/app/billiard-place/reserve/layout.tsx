import React from 'react';
import { LocationProvider } from './_components/context/location-context';
import KakaoMap from '@/app/billiard-place/reserve/_components/map/kakaomap';

export default function RootLayout({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  return (
    <LocationProvider>
      <article className="flex h-screen w-full">
        {/* 모바일 사이드바 */}
        <div className="md:hidden">{mobile}</div>

        {/* 데스크톱 사이드바 */}
        <div className="hidden md:block">{desktop}</div>
        <div className="w-full">
          <KakaoMap />
        </div>
      </article>
    </LocationProvider>
  );
}
