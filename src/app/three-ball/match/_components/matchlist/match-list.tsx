'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { MapPin, Star, User } from 'lucide-react';

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
}

export default function MatchingPage() {
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
    },
    {
      id: '2',
      name: '홍길동',
      profileImage: '/profile1.jpg',
      distance: 0.5,
      location: '서울 강남구',
      score: {
        fourBall: 80,
        threeBall: 40,
      },
    },
  ];

  const registeredUsers: MatchUser[] = [
    // ... 등록된 사용자 데이터
  ];

  const UserCard = ({ user }: { user: MatchUser }) => (
    <div className="mb-2 flex items-center gap-4 bg-white p-4">
      <Avatar className="h-16 w-16">
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <User className="h-8 w-8 text-gray-400" />
        </div>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{user.name}</h3>
          <span className="text-sm text-gray-500">{user.distance}km</span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
          <MapPin size={14} />
          <span>{user.location}</span>
        </div>

        <div className="mt-2 flex gap-4">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500" />
            <span className="text-sm">4구: {user.score.fourBall}점</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500" />
            <span className="text-sm">3구: {user.score.threeBall}점</span>
          </div>
        </div>
      </div>

      <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white">
        매칭신청
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs defaultValue="nearby" className="mt-6 w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nearby">내 주변 상대</TabsTrigger>
          <TabsTrigger value="registered">등록된 상대</TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="!mt-0 bg-gray-100">
          <div className="divide-y">
            {nearbyUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registered" className="bg-gray-100">
          <div className="divide-y">
            {registeredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
