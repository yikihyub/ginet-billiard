'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

import FilterSection from '../filter/filter-section';
import UserCard from '../card/user-card';
import UserRegisterCard from '../card/user-register-card';

import { User } from '@/types/(match)';

export default function TabList() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [maxDistance, setMaxDistance] = useState(50);

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const activeTab = searchParams.get('tab') || 'nearby';

  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  const fetchNearbyUsers = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/member/getmember?maxDistance=${maxDistance}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'nearby') {
      fetchNearbyUsers();
    }
  }, [maxDistance, userId, activeTab]);

  if (loading && activeTab === 'nearby') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4">사용자 검색 중...</p>
        </div>
      </div>
    );
  }

  if (error && activeTab === 'nearby') {
    return (
      <div className="p-4 text-center text-red-600">
        <p>오류가 발생했습니다: {error}</p>
        <button
          onClick={fetchNearbyUsers}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white">
      {/* 탭 콘텐츠 */}
      {activeTab === 'nearby' && (
        <div className="bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">주변회원 목록</div>
            <FilterSection
              maxDistance={maxDistance}
              onMaxDistanceChange={setMaxDistance}
            />
          </div>
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                주변에 등록된 상대가 없습니다
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'registered' && (
        <div className="min-h-[80vh] space-y-4 bg-gray-50 bg-white p-4">
          <UserRegisterCard />
        </div>
      )}
    </div>
  );
}
