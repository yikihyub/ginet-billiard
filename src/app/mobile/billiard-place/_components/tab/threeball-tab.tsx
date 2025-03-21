'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ThreeballTab = () => {
  const pathname = usePathname();

  const navItems = [
    { name: '예약하기', path: '/mobile/billiard-place/reserve', enabled: true },
    { name: '상대찾기', path: '/mobile/match', enabled: true },
  ];

  return (
    <div className="m-auto max-w-1024px">
      <ul className="flex border-b">
        {navItems.map((item) => (
          <li key={item.path} className="mr-1 flex-1 text-center">
            <Link
              href={item.path}
              className={`inline-block rounded-t-lg px-6 py-3 ${
                pathname === item.path
                  ? 'border-b-2 border-black bg-white font-bold text-black'
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

export default ThreeballTab;
