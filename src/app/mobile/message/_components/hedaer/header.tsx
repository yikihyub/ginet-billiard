'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function ChatHeader() {
  const router = useRouter();

  return (
    <>
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b bg-white p-4">
        {/* 왼쪽: 뒤로가기 버튼 */}
        <div className="flex-1">
          <div
            onClick={() => router.push('/mobile')}
            className="w-fit cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </div>
        </div>

        {/* 가운데: 채팅 타이틀 */}
        <div className="flex flex-1 items-center justify-center">
          <div className="text-md font-bold">채팅</div>
        </div>
        <div className="flex-1"></div>
      </div>
    </>
  );
}
