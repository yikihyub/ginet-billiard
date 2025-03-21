import React from 'react';
import KakaoMap from './_components/map/kakaomap';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="flex h-screen w-full">
      <>{children}</>
      <div className="w-full">
        <KakaoMap />
      </div>
    </article>
  );
}
