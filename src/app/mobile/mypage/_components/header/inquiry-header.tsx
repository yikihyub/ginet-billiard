'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function InquiryHeader() {
  const router = useRouter();
  return (
    <div className="flex bg-white px-4 pt-4">
      <div onClick={() => router.back()} className="">
        <ChevronLeft />
      </div>
      <div className="ml-4 text-center font-bold">나의 문의</div>
    </div>
  );
}
