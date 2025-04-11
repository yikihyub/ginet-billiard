import React, { ReactNode } from 'react';

import AdminLayout from './_components/common/admin-layout';

interface AdminPageLayoutProps {
  children: ReactNode;
}

export default function AdminPageLayout({ children }: AdminPageLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
