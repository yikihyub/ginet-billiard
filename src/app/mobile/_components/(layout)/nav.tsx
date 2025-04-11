'use client';

import React from 'react';

import { User, Search, CalendarDays } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import NotificationDropdown from '../(alert)/AlertDropdown';

export default function Nav() {
  // 현재 경로 가져오기
  // const router = useRouter();
  // const shouldShowBackArrow = pathname !== '/mobile';

  // 특정 경로에서는 Nav를 렌더링하지 않음
  // if (pathname.startsWith('/mobile/login')) {
  //   return null;
  // }

  // if (pathname.startsWith('/mobile/billiard-place/reserve')) {
  //   return null;
  // }

  // if (pathname.startsWith('/mobile/signin')) {
  //   return null;
  // }

  // if (
  //   pathname.includes('/eva') ||
  //   pathname.includes('/profile') ||
  //   pathname.includes('/match/request') ||
  //   pathname.includes('/message') ||
  //   pathname.includes('/chat') ||
  //   pathname.includes('/team-match') ||
  //   pathname.includes('/mobile/notice') ||
  //   pathname.includes('/mobile/mypage')
  // ) {
  //   return null;
  // }

  return (
    <nav className="bg-white text-black">
      <div className="container mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* {shouldShowBackArrow && (
            <button
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )} */}
          <Link
            href="/mobile"
            aria-label="Home"
            className="!ml-0 flex items-center"
          >
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
            <Link href="/mobile/management" className="hover:underline">
              <Search />
            </Link>
          </li>
          <li>
            <Link href="/mobile/reservation" className="hover:underline">
              <CalendarDays />
            </Link>
          </li>
          <li>
            <Link href="/mobile/mypage" className="hover:underline">
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
