import React from 'react';

import { ChevronRight, Megaphone } from 'lucide-react';
import Image from 'next/image';

export default function ProfileContainer() {
  // 선수 정보
  const playerInfo = {
    name: '홍길동',
    nickname: '당구의 신',
    level: '프로',
    totalGames: 128,
    winRate: 72.5,
    ranking: 5,
    specialties: ['쓰리쿠션', '포켓볼'],
    highestRun: 15,
    averagePoints: 8.7,
    recentStreak: 'W5',
  };

  return (
    <>
      <div className="relative flex min-h-[250px] items-center bg-gray-100 p-6">
        <Image
          src="/logo/billiard-ball.png"
          alt="회원이미지"
          fill
          className="object-contain p-6"
        />
      </div>
      <div className="bg-white p-4">
        <div className="mb-1 text-xl font-bold">{playerInfo.name}</div>
        <div className="text-sm text-gray-600">
          {playerInfo.nickname} · {playerInfo.level}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {playerInfo.specialties.map((specialty, index) => (
            <span
              key={index}
              className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
            >
              {specialty}
            </span>
          ))}
        </div>
        <div className="border-b pt-4"></div>
        <div className="flex items-center justify-between gap-2 pt-4">
          <div className="flex items-center gap-2">
            <div className="">
              <Megaphone className="h-6 w-4" />
            </div>
            <div className="text-sm font-semibold text-gray-500">
              당구 실력을 더 향상시키고 싶나요?
            </div>
          </div>
          <div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
    </>
  );
}
