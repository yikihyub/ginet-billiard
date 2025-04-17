'use client';

import React from 'react';

import { User, Search, CalendarDays } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import NotificationDropdown from '../(alert)/AlertDropdown';

export default function Nav() {
  return (
    <nav className="bg-white text-black">
      <div className="container mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
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
        </ul>
      </div>
    </nav>
  );
}
