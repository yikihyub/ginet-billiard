import React, { ReactNode } from "react";

interface DesktopDetailPageLayoutProps {
  children: ReactNode;
}

export default function DesktopDetailPageLayout({
  children,
}: DesktopDetailPageLayoutProps) {
  return <div className="max-w-[1024px] m-auto">{children}</div>;
}
