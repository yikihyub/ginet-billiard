'use client';

import React from 'react';

import { MatchStatsProps } from '../../../_types';
import { Calendar, TrendingUp, Users } from 'lucide-react';

export function MatchStats({
  activeMatches,
  totalPlayers,
  popularGame = '4구',
}: MatchStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-4">
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="mb-1 flex items-center gap-1 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="text-xs">활성 매치</span>
        </div>
        <span className="font-semibold">{activeMatches}개</span>
      </div>
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="mb-1 flex items-center gap-1 text-gray-600">
          <Users className="h-4 w-4" />
          <span className="text-xs">총 경기</span>
        </div>
        <span className="font-semibold">{totalPlayers}명</span>
      </div>
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="mb-1 flex items-center gap-1 text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">인기 종목</span>
        </div>
        <span className="font-semibold">{popularGame}</span>
      </div>
    </div>
  );
}
