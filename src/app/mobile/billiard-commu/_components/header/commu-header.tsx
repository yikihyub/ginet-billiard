'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function CommuHeader() {
  const router = useRouter();
  return (
    <div className="flex items-center pl-4 pr-4 pt-4">
      <div onClick={() => router.back()}>
        <ChevronLeft />
      </div>
      <div className="ml-4 text-center font-bold">커뮤니티</div>
    </div>
  );
}
