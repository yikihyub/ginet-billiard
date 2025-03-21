import React from 'react';
import Navigation from '../_components/(main)/main-nav';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto max-w-[1024px]">
      <Navigation />
      <>{children}</>
    </div>
  );
}
