'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function LoginNav() {
  const router = useRouter();
  const pathname = usePathname();

  // pathname이 signup을 포함하는지 확인하고 제목 설정
  const getTitle = () => {
    if (pathname?.includes('signin')) {
      return '회원가입';
    }
    return '';
  };

  return (
    <>
      <nav className="bg-white text-black">
        <div className="absolute top-0 mx-auto w-full max-w-screen-lg px-4 py-3">
          <div className="grid grid-cols-3 items-center">
            {/* 왼쪽 영역 */}
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            </div>

            {/* 중앙 영역 - 타이틀 */}
            <div className="flex justify-center text-center text-xl font-bold">
              {getTitle()}
            </div>

            {/* 오른쪽 영역 */}
            <div></div>
          </div>
        </div>
      </nav>
    </>
  );
}
