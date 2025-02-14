import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { MapPin, Star, User, Clock } from 'lucide-react';

interface MatchUser {
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

export default function UserCard({ user }: { user: MatchUser }) {
  return (
    <>
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
                  <span className="text-sm font-medium">4구: ''점</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-sm font-medium">3구: ''점</span>
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
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                {user.preferredGame}
              </span>
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
    </>
  );
}
