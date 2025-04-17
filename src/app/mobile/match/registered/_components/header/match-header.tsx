'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function MatchHeader() {
  const router = useRouter();
  return (
    <div className="flex items-center bg-white p-4">
      <div onClick={() => router.back()}>
        <ChevronLeft />
      </div>
      <div className="ml-4 text-center font-bold">경기찾기</div>
    </div>
  );
}
