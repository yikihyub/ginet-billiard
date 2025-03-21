import React, { ReactNode } from 'react';
import LoginNav from './_components/login-nav/login-nav';

interface LoginMobileLayoutProps {
  children: ReactNode;
}

export default function LoginMobileLayout({
  children,
}: LoginMobileLayoutProps) {
  return (
    <>
      <LoginNav />
      {children}
    </>
  );
}
