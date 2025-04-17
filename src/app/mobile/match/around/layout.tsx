import React from 'react';

import AroundHeader from './_components/header/around-header';
import AroundTab from './_components/header/around-tab';

import { MemberSearchPageLayoutProps } from '../_types';

export default function MemberSearchPageLayout({
  children,
}: MemberSearchPageLayoutProps) {
  return (
    <div className="bg-gray-50">
      <AroundHeader />
      <AroundTab />
      {children}
    </div>
  );
}
