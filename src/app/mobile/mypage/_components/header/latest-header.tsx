'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function LatestHeader() {
  const router = useRouter();
  return (
    <div className="flex bg-white px-4 pb-2 pt-4">
      <div onClick={() => router.back()} className="">
        <ChevronLeft />
      </div>
      <div className="ml-4 text-center font-bold">최근 게시글</div>
    </div>
  );
}
