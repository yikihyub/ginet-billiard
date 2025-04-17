import React, { ReactNode } from 'react';
import InquiryTab from '../../_components/tab/inquiry-tab';
import InquiryHeader from '../../_components/header/inquiry-header';

interface MyInquiresPageLayoutProp {
  children: ReactNode;
}

export default function MyInquiresPageLayout({
  children,
}: MyInquiresPageLayoutProp) {
  return (
    <div className="min-h-screen bg-white">
      <InquiryHeader />
      <InquiryTab />
      {children}
    </div>
  );
}
