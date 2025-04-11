'use client';

import React from 'react';
import { Users, TrendingUp, Clock } from 'lucide-react';

interface LiveVisitorsCardProps {
  currentVisitors: number;
  totalToday: number;
  peakToday: number;
  isLoading: boolean;
}

const LiveVisitorsCard: React.FC<LiveVisitorsCardProps> = ({
  currentVisitors,
  totalToday,
  peakToday,
  isLoading,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* 실시간 접속자 */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-blue-100 p-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">실시간 접속자</h3>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              <p className="text-2xl font-bold">{currentVisitors}</p>
            )}
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          최근 5분 이내 활동이 있는 방문자 수
        </div>
      </div>

      {/* 오늘 총 방문자 */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-green-100 p-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              오늘 총 방문자
            </h3>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              <p className="text-2xl font-bold">{totalToday}</p>
            )}
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          오늘 하루 동안의 총 고유 방문자 수
        </div>
      </div>

      {/* 최고 동시 접속자 */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-purple-100 p-3">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              최고 동시 접속자
            </h3>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              <p className="text-2xl font-bold">{peakToday}</p>
            )}
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          오늘 기록된 시간대별 최대 접속자 수
        </div>
      </div>
    </div>
  );
};

export default LiveVisitorsCard;
