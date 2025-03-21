import Image from 'next/image';
import React, { Suspense } from 'react';
import LoginNav from './_components/login-nav/login-nav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 모바일 사이드바 */}
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Image
              width={150}
              height={80}
              src="/logo/logo_banner_b.png"
              alt=""
            />
          </div>
        }
      >
        <>
          <LoginNav />
          {children}
        </>
      </Suspense>
    </>
  );
}
