import React, { ReactNode, Suspense } from 'react';

interface ReportUserLayoutProps {
  children: ReactNode;
}

export default function ReportUserLayout({ children }: ReportUserLayoutProps) {
  return <Suspense fallback={<div>loading...</div>}>{children}</Suspense>;
}
