'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function QuickMenu() {
  const router = useRouter();

  const buttons = [
    {
      id: 1,
      text: '매칭등록',
      url: '/mobile/team-match',
      icon: (
        <Image
          src="/main/icons8-billiard-70.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 2,
      text: '당구장찾기',
      url: '/mobile/billiard-place/reserve',
      icon: (
        <Image
          src="/main/icons8-snooker-64.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 3,
      text: '상대찾기',
      url: '/mobile/match/around',
      icon: (
        <Image
          src="/main/icons8-사람-피부-유형-7-70.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 4,
      text: '매칭찾기',
      url: '/mobile/match/registered',
      icon: (
        <Image
          src="/main/icons8-사람-피부-유형-7-70.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 5,
      text: '커뮤니티',
      url: '/mobile/billiard-commu/main',
      icon: (
        <Image
          src="/main/icons8-이야기-책-70.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 6,
      text: '동호회',
      url: '/mobile/club/search',
      icon: (
        <Image
          src="/main/icons8-american-67.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
    {
      id: 7,
      text: '채팅방',
      url: '/mobile/message',
      icon: (
        <Image
          src="/main/icons8-snooker-66.png"
          alt="트로피"
          width={46}
          height={46}
        />
      ),
    },
  ];

  return (
    <>
      <div className="m-auto grid grid-cols-4 gap-2 p-2 pb-4 pt-8">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => router.push(button.url)}
            className="flex flex-col items-center justify-center rounded-xl bg-white pl-4 pr-4 transition-shadow hover:shadow-md"
          >
            <span className="mb-1 text-xl">{button.icon}</span>
            <span className="whitespace-nowrap text-sm text-gray-700">
              {button.text}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
