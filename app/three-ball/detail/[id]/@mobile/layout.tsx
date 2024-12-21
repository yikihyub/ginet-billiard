import React, { ReactNode } from "react";

interface MobileDetailLayoutProps {
  children: ReactNode;
}

export default function MobileDetailLayout({
  children,
}: MobileDetailLayoutProps) {
  return <div className="bg-gray-200">{children}</div>;
}
