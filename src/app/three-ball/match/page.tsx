'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import {
  MapPin,
  Star,
  User,
  Clock,
  Filter,
  Search,
  Calendar,
} from 'lucide-react';
import MainBanner from './_components/banner/main-banner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MatchUser {
  id: string;
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

export default function MatchingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');

  const nearbyUsers: MatchUser[] = [
    {
      id: '1',
      name: '김철수',
      profileImage: '/profile1.jpg',
      distance: 0.5,
      location: '서울 강남구',
      score: {
        fourBall: 80,
        threeBall: 40,
      },
      preferredTime: '저녁 7시 이후',
      level: '중급',
      matchCount: 25,
      winRate: 65,
      lastActive: '방금 전',
      preferredGame: ['4구', '3구'],
    },
    {
      id: '2',
      name: '홍길동',
      profileImage: '/profile2.jpg',
      distance: 1.2,
      location: '서울 서초구',
      score: {
        fourBall: 95,
        threeBall: 75,
      },
      preferredTime: '주말 종일',
      level: '고급',
      matchCount: 42,
      winRate: 78,
      lastActive: '10분 전',
      preferredGame: ['3구'],
    },
  ];

  const UserCard = ({ user }: { user: MatchUser }) => (
    <div className="mb-4 rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
            <User className="h-10 w-10 text-gray-400" />
          </div>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <span className="text-sm text-gray-500">
                {user.level} · {user.matchCount}경기
              </span>
            </div>
            <div className="text-right">
              <span className="block text-sm font-medium text-blue-600">
                {user.distance}km
              </span>
              <span className="text-xs text-gray-500">{user.lastActive}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>{user.location}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-sm font-medium">
                  4구: {user.score.fourBall}점
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-sm font-medium">
                  3구: {user.score.threeBall}점
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="text-sm">
                <Clock size={14} className="mb-1 inline-block" />{' '}
                {user.preferredTime}
              </div>
              <div className="text-sm">
                승률:{' '}
                <span className="font-medium text-green-600">
                  {user.winRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {user.preferredGame.map((game) => (
              <span
                key={game}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600"
              >
                {game}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" className="text-sm">
          프로필 보기
        </Button>
        <Button className="bg-blue-600 text-sm hover:bg-blue-700">
          매칭신청
        </Button>
      </div>
    </div>
  );

  const FilterSection = () => (
    <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <Input
          placeholder="이름 또는 지역으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          필터
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant={selectedGame === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedGame('all')}
        >
          전체
        </Button>
        <Button
          variant={selectedGame === '4ball' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedGame('4ball')}
        >
          4구
        </Button>
        <Button
          variant={selectedGame === '3ball' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedGame('3ball')}
        >
          3구
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <MainBanner />
      <div className="mt-2 min-h-screen p-4">
        <div className="w-full">
          <Tabs defaultValue="nearby" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nearby">내 주변 상대</TabsTrigger>
              <TabsTrigger value="registered">등록된 상대</TabsTrigger>
            </TabsList>

            <FilterSection />

            <TabsContent value="nearby" className="space-y-4 bg-gray-50">
              {nearbyUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </TabsContent>

            <TabsContent value="registered" className="space-y-4">
              {nearbyUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
