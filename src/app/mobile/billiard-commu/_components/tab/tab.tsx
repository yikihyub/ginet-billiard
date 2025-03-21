'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Tab() {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = pathname.includes('/mobile/billiard-commu/iactive')
    ? 'iactive'
    : 'main';

  return (
    <div className="flex space-x-2 border-b bg-white">
      <button
        className={`flex-1 px-4 py-2 text-sm font-medium ${
          activeTab === 'main'
            ? 'border-b-2 border-green-600 text-green-600'
            : 'text-gray-500'
        }`}
        onClick={() => router.push('/mobile/billiard-commu/main')}
      >
        메인
      </button>
      <button
        className={`flex-1 px-4 py-2 text-sm font-medium ${
          activeTab === 'iactive'
            ? 'border-b-2 border-green-600 text-green-600'
            : 'text-gray-500'
        }`}
        onClick={() => router.push('/mobile/billiard-commu/iactive')}
      >
        나의 글
      </button>
    </div>
  );
}
