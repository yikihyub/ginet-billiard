'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AroundTab = () => {
  const pathname = usePathname();
  if (pathname.includes('/profile')) {
    return null;
  }
  if (pathname.includes('/report-user')) {
    return null;
  }

  const navItems = [
    { name: '회원 검색', path: '/mobile/match/around', enabled: true },
    {
      name: '경기 진행',
      path: '/mobile/match/around/result',
      enabled: true,
    },
  ];

  return (
    <div className="bg-white">
      <ul className="flex border-b">
        {navItems.map((item) => (
          <li key={item.path} className="mr-1 flex-1 text-center">
            <Link
              href={item.path}
              className={`inline-block rounded-t-lg px-6 pb-3 ${
                pathname === item.path
                  ? 'border-b-2 border-green-600 bg-white font-bold text-green-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              } `}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AroundTab;
