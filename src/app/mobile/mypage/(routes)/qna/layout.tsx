import React, { ReactNode } from 'react';
import InquiryTab from '../../_components/tab/inquiry-tab';

interface MyInquiresPageLayoutProp {
  children: ReactNode;
}

export default function MyInquiresPageLayout({
  children,
}: MyInquiresPageLayoutProp) {
  return (
    <div className="min-h-screen bg-white">
      <InquiryTab />
      {children}
    </div>
  );
}
