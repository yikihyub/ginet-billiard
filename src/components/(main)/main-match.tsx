'use client';

import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import DateSelector from '../date-selector';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '../ui/label';

export default function MainMatch() {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  const matches = [
    {
      time: '23:00',
      location: '서울 남녀나눔 당구장',
      player1: {
        name: '김선수',
        rating: 'A+',
        avatar: '/api/placeholder/100/100',
      },
      player2: {
        name: '이선수',
        rating: 'A',
        avatar: '/api/placeholder/100/100',
      },
      format: '1vs1',
      status: '경기중',
    },
    {
      time: '23:40',
      location: '서울 두꺼비 당구장',
      player1: {
        name: '박선수',
        rating: 'B+',
        avatar: '/api/placeholder/100/100',
      },
      player2: {
        name: '최선수',
        rating: 'B+',
        avatar: '/api/placeholder/100/100',
      },
      format: '1vs1',
      status: '대기중',
    },
  ];

  return (
    <div className="m-auto max-w-1024px space-y-4 p-4">
      {/* 필터 버튼 */}
      <DateSelector />

      {/* 필터 옵션 */}
      <div className="flex gap-3 text-sm">
        <button className="flex items-center gap-1">
          내 지역 <span>▼</span>
        </button>
        <button className="flex items-center gap-1 text-orange-500">
          🔥 해택
        </button>
        <button>마감 가리기</button>
        <button className="flex items-center gap-1">
          성별 <span>▼</span>
        </button>
        <button className="flex items-center gap-1">
          다마 <span>▼</span>
        </button>
      </div>

      <div className="relative space-y-4">
        <span className="ml-2 rounded-lg border border-blue-400 bg-white px-3 py-1 text-blue-600 shadow-sm">
          3구
        </span>

        {matches.map((match, index) => (
          <div key={index} className="rounded-lg border bg-white p-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">{match.time}</span>
              <span
                className={`rounded px-2 py-1 text-sm ${
                  match.status === '경기중'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {match.status}
              </span>
            </div>

            <div className="mb-4 text-sm text-gray-600">{match.location}</div>

            <div className="flex items-center justify-between">
              {/* Player 1 */}
              <div className="flex flex-col items-center">
                <Image
                  src="/main/profile_img.png"
                  height={80}
                  width={80}
                  alt={match.player1.name}
                  className="mb-2 h-20 w-20 rounded-full object-cover"
                />
                <span className="font-medium">{match.player1.name}</span>
                <span className="text-sm text-gray-600">
                  Rating: {match.player1.rating}
                </span>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center px-4">
                <span className="text-2xl font-bold text-gray-400">VS</span>
                <span className="mt-2 rounded bg-gray-100 px-2 py-1 text-sm">
                  {match.format}
                </span>
              </div>

              {/* Player 2 */}
              <div className="flex flex-col items-center">
                <Image
                  height={80}
                  width={80}
                  src="/main/profile_img.png"
                  alt={match.player2.name}
                  className="mb-2 h-20 w-20 rounded-full object-cover"
                />
                <span className="font-medium">{match.player2.name}</span>
                <span className="text-sm text-gray-600">
                  Rating: {match.player2.rating}
                </span>
              </div>
            </div>
          </div>
        ))}

        <Label>4구</Label>
        {matches.map((match, index) => (
          <div key={index} className="rounded-lg border bg-white p-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">{match.time}</span>
              <span
                className={`rounded px-2 py-1 text-sm ${
                  match.status === '경기중'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {match.status}
              </span>
            </div>

            <div className="mb-4 text-sm text-gray-600">{match.location}</div>

            <div className="flex items-center justify-between">
              {/* Player 1 */}
              <div className="flex flex-col items-center">
                <Image
                  src="/main/profile_img.png"
                  height={80}
                  width={80}
                  alt={match.player1.name}
                  className="mb-2 h-20 w-20 rounded-full object-cover"
                />
                <span className="font-medium">{match.player1.name}</span>
                <span className="text-sm text-gray-600">
                  Rating: {match.player1.rating}
                </span>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center px-4">
                <span className="text-2xl font-bold text-gray-400">VS</span>
                <span className="mt-2 rounded bg-gray-100 px-2 py-1 text-sm">
                  {match.format}
                </span>
              </div>

              {/* Player 2 */}
              <div className="flex flex-col items-center">
                <Image
                  height={80}
                  width={80}
                  src="/main/profile_img.png"
                  alt={match.player2.name}
                  className="mb-2 h-20 w-20 rounded-full object-cover"
                />
                <span className="font-medium">{match.player2.name}</span>
                <span className="text-sm text-gray-600">
                  Rating: {match.player2.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
        {!userId && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-transparent to-gray-900/90 backdrop-blur-sm">
            <Lock className="mb-4 h-12 w-12 text-white" />
            <div className="px-4 text-center text-white">
              <p className="mb-2 text-xl font-semibold">
                자세한 매칭 정보를 보려면 로그인이 필요합니다
              </p>
              <Link href="/login">
                <button className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600">
                  로그인하기
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
