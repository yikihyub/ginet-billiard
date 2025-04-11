'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function NoticeHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (
      pathname.startsWith('/mobile/notice/') &&
      pathname !== '/mobile/notice'
    ) {
      router.push('/mobile/notice');
    } else {
      router.push('/mobile');
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4">
      <div className="flex flex-1 items-center">
        <button onClick={handleBack}>
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 text-center">
        <span className="text-md font-bold">공지사항</span>
      </div>
      <div className="flex-1" />
    </div>
  );
}
