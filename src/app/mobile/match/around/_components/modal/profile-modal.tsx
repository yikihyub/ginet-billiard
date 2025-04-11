'use client';

import React from 'react';
import { User, X } from 'lucide-react';

import { MatchUser } from '@/types/(match)';

export default function ProfileModal({
  user,
  onClose,
}: {
  user: MatchUser;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-4 shadow-lg">
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {/* 프로필 헤더 */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <User className="h-10 w-10 text-gray-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="text-sm text-gray-500">
              {user.level} · {user.matchCount}경기
            </div>
            <div className="mt-1 flex gap-2">
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                {user.preferGame === 'THREE_BALL' ? '3구' : '4구'}
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                {user.distance.toFixed(1)}km
              </span>
            </div>
          </div>
        </div>

        {/* 프로필 세부정보 */}
        <div className="mt-4 space-y-4">
          {/* 능력치 */}
          <div className="rounded-lg bg-gray-50 p-3">
            <h3 className="mb-2 text-sm font-semibold">능력치</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-white p-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">4구</span>
                </div>
                <div className="mt-1 text-lg font-bold">
                  {user.user_four_ability || 0}점
                </div>
              </div>
              <div className="rounded-md bg-white p-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">3구</span>
                </div>
                <div className="mt-1 text-lg font-bold">
                  {user.user_three_ability || 0}점
                </div>
              </div>
            </div>
          </div>

          {/* 활동 정보 */}
          <div className="rounded-lg bg-gray-50 p-3">
            <h3 className="mb-2 text-sm font-semibold">활동 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">선호 시간</span>
                <span className="font-medium">{user.preferred_time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">선호 게임</span>
                <span className="font-medium">{user.preferGame}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">최근 활동</span>
                <span className="font-medium">{user.lastActive}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">승률</span>
                <span className="font-medium">{user.winRate}%</span>
              </div>
            </div>
          </div>

          {/* 매치 신청 버튼 */}
          <button
            className="w-full rounded-lg bg-green-500 py-3 text-center font-medium text-white"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
