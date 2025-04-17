'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function AroundHeader() {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname.includes('/profile')) {
    return null;
  }

  return (
    <div className="flex items-center bg-white p-4">
      <div className="flex items-center">
        <button onClick={() => router.push('/mobile')}>
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="text-md ml-4 font-bold">주변 회원목록</div>
    </div>
  );
}
