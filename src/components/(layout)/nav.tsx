'use client';

import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { User, Search, CalendarDays, ChevronLeft } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import NotificationDropdown from '../(alert)/AlertDropdown';

export default function Nav() {
  const pathname = usePathname(); // 현재 경로 가져오기
  const router = useRouter();
  const shouldShowBackArrow = pathname !== '/';

  // 특정 경로에서는 Nav를 렌더링하지 않음
  if (pathname.startsWith('/login')) {
    return null;
  }

  if (pathname.startsWith('/signin')) {
    return null;
  }

  return (
    <nav className="bg-white text-black">
      <div className="container mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          {shouldShowBackArrow && (
            <button
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <Link href="/" aria-label="Home" className="!ml-0 flex items-center">
            <Image
              src="/logo/main_logo.png"
              alt="Website Logo"
              width={60}
              height={32}
              priority={true}
              className="h-auto w-auto"
            />
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <NotificationDropdown />
          </li>
          <li>
            <Link href="/record" className="hover:underline">
              <Search />
            </Link>
          </li>
          <li>
            <Link href="/reservation" className="hover:underline">
              <CalendarDays />
            </Link>
          </li>
          <li>
            <Link href="/mypage" className="hover:underline">
              <User />
            </Link>
          </li>
          {/* <li>
            <MenuToggle />
          </li> */}
        </ul>
      </div>
    </nav>
  );
}
