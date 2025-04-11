import React, { ReactNode } from 'react';

interface MemberSearchPageLayoutProps {
  children: ReactNode;
}

export default function MemberSearchPageLayout({
  children,
}: MemberSearchPageLayoutProps) {
  return <div>{children}</div>;
}
