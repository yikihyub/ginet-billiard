'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserCard from './_components/card/user-card';
import FilterSection from './_components/filter/filter-section';

interface User {
  id: number;
  name: string;
  profileImage: string;
  distance: number;
  location: string;
  score: {
    fourBall: number;
    threeBall: number;
  };
  preferredTime: string;
  level: string;
  matchCount: number;
  winRate: number;
  lastActive: string;
  preferredGame: string[];
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/member/getmember')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Tabs defaultValue="nearby" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="nearby">내 주변 상대</TabsTrigger>
        <TabsTrigger value="registered">등록된 상대</TabsTrigger>
      </TabsList>

      <FilterSection />

      <TabsContent value="nearby" className="space-y-4 bg-gray-50">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </TabsContent>

      <TabsContent value="registered" className="space-y-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </TabsContent>
    </Tabs>
  );
}
