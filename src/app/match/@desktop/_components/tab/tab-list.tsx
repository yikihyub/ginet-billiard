'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { User } from '@/types/(match)';

import FilterSection from '../filter/filter-section';
import UserCard from '../card/user-card';
import UserRegisterCard from '../card/user-register-card';

export default function TabList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(20);

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
    fetchNearbyUsers();
  }, [maxDistance, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4">사용자 검색 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
    <Tabs defaultValue="nearby" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="nearby">내 주변 상대</TabsTrigger>
        <TabsTrigger value="registered">등록된 상대</TabsTrigger>
      </TabsList>

      <TabsContent
        value="nearby"
        className="min-h-[80vh] space-y-4 bg-gray-50 p-4"
      >
        <FilterSection
          maxDistance={maxDistance}
          onMaxDistanceChange={setMaxDistance}
        />
        {users.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            주변에 등록된 상대가 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent
        value="registered"
        className="min-h-[80vh] space-y-4 bg-gray-50 p-4"
      >
        <UserRegisterCard />
      </TabsContent>
    </Tabs>
  );
}
