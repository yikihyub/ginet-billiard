'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

export default function ProfileHeader() {
  const router = useRouter();
  return (
    <div className="flex w-full items-center bg-white p-4">
      <div className="flex-[0.5]" onClick={() => router.back()}>
        <ChevronLeft className="text-black" />
      </div>
      <div className="font-semibold">프로필 확인</div>
    </div>
  );
}
