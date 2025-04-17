'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BlockHeader() {
  const router = useRouter();
  return (
    <div className="flex bg-white p-4">
      <div onClick={() => router.back()} className="">
        <ChevronLeft />
      </div>
      <div className="ml-4 text-center font-bold">차단 사용자 관리</div>
    </div>
  );
}
