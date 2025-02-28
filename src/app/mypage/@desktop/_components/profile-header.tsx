'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSession } from 'next-auth/react';

interface UserData {
  name?: string;
  email?: string;
  user_four_ability?: number;
  user_three_ability?: number;
}

export default function ProfileHeader() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/member/getinfomember?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      });
  }, [userId]);

  return (
    <div
      className={`flex px-6 py-4 ${
        isMobile ? 'flex-col gap-4' : 'items-center justify-between'
      } border-b`}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/profile.png" alt="프로필" />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            {userData && <span className="font-medium">{userData.name}</span>}
            <span className="text-gray-400">{'>'}</span>
          </div>
          {userData && (
            <div className="text-sm text-gray-500">{userData.email}</div>
          )}
        </div>
      </div>

      <div
        className={`flex ${
          isMobile ? 'justify-between' : ''
        } items-center gap-6`}
      >
        <div className="text-center">
          <p className="text-sm text-gray-600">3구</p>
          {userData && (
            <p className="font-bold">{userData.user_three_ability}</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">4구</p>
          {userData && (
            <p className="font-bold">{userData.user_four_ability}</p>
          )}
        </div>
        <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium">
          정보수정
        </button>
      </div>
    </div>
  );
}
