import React, { Suspense } from 'react';
import PopupManager from '@/components/popup/popup-manager';

interface MobileRootLayoutProps {
  children: React.ReactNode;
}

export default function MobileRootLayout({ children }: MobileRootLayoutProps) {
  return (
    <>
      {' '}
      <div>{children}</div>
      <Suspense fallback={null}>
        <PopupManager location="client" />
      </Suspense>
    </>
  );
}
