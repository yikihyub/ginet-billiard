'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function MypageHeader() {
  const router = useRouter();
  return (
    <div className="flex justify-between bg-white p-4">
      <div onClick={() => router.back()} className="flex-1">
        <ChevronLeft />
      </div>
      <div className="flex-1 text-center font-bold">내 정보</div>
      <div className="flex-1"></div>
    </div>
  );
}
