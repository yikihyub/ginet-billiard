'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname(); // useSearchParams 대신 usePathname 사용

  const navItems = [
    { name: '홈', path: '/', enabled: true },
    { name: '당구장찾기', path: '/billiard-place/reserve', enabled: true },
    { name: '매칭등록', path: '/team-match', enabled: true },
    { name: '공지사항', path: '/notice', enabled: true },
  ];

  return (
    <div className="m-auto max-w-1024px p-4">
      <div className="flex items-center justify-start gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`text-md transition-colors ${
              pathname === item.path
                ? 'font-bold text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
