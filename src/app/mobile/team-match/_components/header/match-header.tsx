'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function MatchHeader() {
  const router = useRouter();

  return (
    <div className="fiexed top-0 flex h-12 items-center">
      <div
        onClick={() => {
          router.back();
        }}
      >
        <ChevronLeft />
      </div>
      <div className="ml-4 text-lg font-bold">경기 만들기</div>
    </div>
  );
}
