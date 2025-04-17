import React, { ReactNode } from 'react';
import MatchHeader from './_components/header/match-header';

interface MemberSearchPageLayoutProps {
  children: ReactNode;
}

export default function MemberSearchPageLayout({
  children,
}: MemberSearchPageLayoutProps) {
  return (
    <div>
      <MatchHeader />
      {children}
    </div>
  );
}
