'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EvaHeader() {
  const router = useRouter();
  return (
    <>
      {/* 헤더 */}
      <div className="flex items-center gap-4 border-b p-4">
        <div onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </div>
        <div className="text-lg font-bold">후기 작성</div>
      </div>
    </>
  );
}
