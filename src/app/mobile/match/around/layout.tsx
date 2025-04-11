import React from 'react';

import { UserProvider } from './_components/context/match-context';
import { MemberSearchPageLayoutProps } from '../_types';
import AroundHeader from './_components/header/around-header';

export default function MemberSearchPageLayout({
  children,
}: MemberSearchPageLayoutProps) {
  return (
    <UserProvider>
      <div className="bg-gray-50">
        <AroundHeader />
        {children}
      </div>
    </UserProvider>
  );
}
