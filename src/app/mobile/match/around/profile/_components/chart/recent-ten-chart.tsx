'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { MemberReview } from '@/types/(match)';

interface RecentTenChartProps {
  reviews: MemberReview[];
  profileUserId?: string; // 현재 보고 있는 프로필의 사용자 ID
}

export default function RecentTenChart({
  reviews,
  profileUserId,
}: RecentTenChartProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.mb_id;
  const matches = reviews || [];

  // 현재 보고 있는 프로필의 사용자 ID (props로 받은 값 또는 현재 로그인한 사용자)
  const targetUserId = profileUserId || currentUserId;

  // 승률 계산 - 현재 보고 있는 프로필의 사용자 ID 사용
  const calculateWinRate = () => {
    if (!matches.length || !targetUserId) return 0;

    const winCount = matches.filter(
      (match) => match.winner_id === targetUserId
    ).length;

    return (winCount / matches.length) * 100;
  };

  const winRate = calculateWinRate();

  // 게임 종류 포맷팅
  const formatGameType = (gameType: string = '') => {
    switch (gameType) {
      case 'THREE_BALL':
        return '3구';
      case '3ball':
        return '3구';
      case 'FOUR_BALL':
        return '4구';
      case '4ball':
        return '4구';
      case 'POCKET':
        return '포켓볼';
      case 'pocket':
        return '포켓볼';
      default:
        return gameType;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string = '') => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  if (!matches.length) {
    return (
      <div className="mb-2 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-md font-bold text-gray-800">최근 10경기</h3>
        </div>
        <div className="py-6 text-center text-gray-500">
          최근 경기 기록이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-md font-bold text-gray-800">최근 10경기</h3>
        <div className="flex items-center rounded-full bg-green-50 px-3 py-1">
          <span className="font-bold text-green-600">
            승률: {winRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {matches.map((match) => {
          // 현재 보고 있는 프로필의 사용자가 승자인지 확인
          const isWinner = match.winner_id === targetUserId;
          const opponentName = match.author || '상대방';

          return (
            <div
              key={match.id || match.match_id}
              className="flex flex-col py-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`mr-2 h-2 w-2 rounded-full ${
                      isWinner ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  <span className="font-medium text-gray-800">
                    vs {opponentName}
                  </span>
                </div>
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    isWinner
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {isWinner ? '승리' : '패배'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(match.date || match.match_date)}
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center">
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {formatGameType(match.game_type)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
