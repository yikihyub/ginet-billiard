'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ClubTab = () => {
  const pathname = usePathname();

  const navItems = [
    { name: '동호회 검색', path: '/mobile/club/search', enabled: true },
    { name: '동호회 등록', path: '/mobile/club/register', enabled: true },
  ];

  return (
    <div className="m-auto max-w-1024px">
      <ul className="flex border-b">
        {navItems.map((item) => (
          <li key={item.path} className="mr-1 flex-1 text-center">
            <Link
              href={item.path}
              className={`inline-block rounded-t-lg px-6 py-3 ${
                pathname?.startsWith(item.path)
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

export default ClubTab;
