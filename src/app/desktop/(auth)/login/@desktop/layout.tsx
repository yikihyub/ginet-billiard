import React, { ReactNode } from 'react';
import LoginNav from '../../_components/login-nav';

interface LoginDesktopLayoutProps {
  children: ReactNode;
}

export default function LoginMobileLayout({
  children,
}: LoginDesktopLayoutProps) {
  return (
    <>
      <LoginNav />
      {children}
    </>
  );
}
