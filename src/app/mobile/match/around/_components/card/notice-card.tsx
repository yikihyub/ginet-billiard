'use client';

import React from 'react';

export default function NoticeCard() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="text-2xl font-semibold text-[#969CA0]">0회 (0/3)</div>
      <div className="flex flex-col items-center text-sm font-semibold text-[#969CA0]">
        <div>하루 최대 3명까지 매칭 신청을 보낼 수 있습니다.</div>
        <div>
          3회 초과 시 <span className="underline">1:1 문의</span> 해주세요.
        </div>
      </div>
    </div>
  );
}
