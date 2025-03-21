import React, { ReactNode } from 'react';

interface DesktopDetailPageLayoutProps {
  children: ReactNode;
}

export default function DesktopDetailPageLayout({
  children,
}: DesktopDetailPageLayoutProps) {
  return <div className="m-auto max-w-[1024px]">{children}</div>;
}
