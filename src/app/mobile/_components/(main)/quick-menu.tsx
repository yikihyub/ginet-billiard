import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function QuickMenu() {
  const buttons = [
    {
      id: 1,
      text: '상대찾기',
      url: '/mobile/match/around',
      icon: '/icon/icon1_96.jpg',
    },
    {
      id: 2,
      text: '매칭등록',
      url: '/mobile/team-match',
      icon: '/icon/icon2_96.jpg',
    },
    {
      id: 3,
      text: '당구장찾기',
      url: '/mobile/billiard-place/reserve',
      icon: '/icon/icon3_96.jpg',
    },
    {
      id: 4,
      text: '매칭찾기',
      url: '/mobile/match/registered',
      icon: '/icon/icon4_96.jpg',
    },
    {
      id: 5,
      text: '커뮤니티',
      url: '/mobile/billiard-commu/main',
      icon: '/icon/icon5_96.jpg',
    },
    {
      id: 6,
      text: '동호회',
      url: '/mobile/club/search',
      icon: '/icon/icon6_96.jpg',
    },
    {
      id: 7,
      text: '레슨',
      url: '/mobile/lesson',
      icon: '/icon/icon7_96.jpg',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 px-4 pb-6 pt-8">
      {buttons.map((button) => (
        <Link key={button.id} href={button.url}>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-1">
            <div className="relative h-[36px] w-[36px] bg-white">
              <Image
                src={button.icon}
                alt={button.text}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <span className="mt-1 text-center text-xs text-gray-700">
              {button.text}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
