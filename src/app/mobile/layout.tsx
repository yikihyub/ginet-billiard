import React from 'react';
import Nav from './_components/(layout)/nav';

interface MobileRootLayoutProps {
  children: React.ReactNode;
}

export default function MobileRootLayout({ children }: MobileRootLayoutProps) {
  return (
    <>
      {' '}
      <Nav />
      {children}
    </>
  );
}
