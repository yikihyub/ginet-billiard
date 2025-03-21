import React, { ReactNode } from 'react';
import Nav from './_components/(layout)/nav';
import Footer from './_components/(layout)/footer';

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="">
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
