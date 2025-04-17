'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function ClubHeader() {
  const router = useRouter();
  return (
    <div className="flex items-center p-4">
      <div onClick={() => router.back()}>
        <ChevronLeft />
      </div>
      <div className="ml-4 text-center font-bold">동호회 찾기</div>
    </div>
  );
}
