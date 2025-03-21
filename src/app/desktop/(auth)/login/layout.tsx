'use client';

import Image from 'next/image';
import React, { Suspense } from 'react';
export default function RootLayout({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  return (
    <>
      {/* 모바일 사이드바 */}
      <Suspense
        fallback={
          <div>
            <Image
              width={150}
              height={80}
              src="/logo/logo_banner_b.png"
              alt=""
            />
          </div>
        }
      >
        <div className="w-full md:hidden">{mobile}</div>
      </Suspense>
      <Suspense fallback={<div>Loading Mobile... </div>}>
        {/* 데스크톱 사이드바 */}
        <div className="hidden md:block">{desktop}</div>
      </Suspense>
    </>
  );
}
