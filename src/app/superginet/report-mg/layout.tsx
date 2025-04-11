import React, { ReactNode, Suspense } from 'react';

interface ReportManagementLayout {
  children: ReactNode;
}

export default function ReportManagementLayout({
  children,
}: ReportManagementLayout) {
  <Suspense fallback={<div>...</div>}>{children}</Suspense>;
}
