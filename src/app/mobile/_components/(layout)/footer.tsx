import React from 'react';
import Link from 'next/link';

import { Home, MessageCircle, Bell, User, Search } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 z-50 h-[60px] w-full bg-gray-50 shadow-md">
      <div className="flex h-full items-center justify-around border-t px-4">
        <Link href="/mobile/message">
          <button className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-black">
            <MessageCircle className="h-5 w-5" />
            <span>채팅</span>
          </button>
        </Link>
        <Link href="/mobile/billiard-place/reserve">
          <button className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-black">
            <Search className="h-5 w-5" />
            <span>검색</span>
          </button>
        </Link>
        <Link href="/">
          <button className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-black">
            <Home className="h-5 w-5" />
            <span>홈</span>
          </button>
        </Link>
        <Link href="/mobile/alert">
          <button className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-black">
            <Bell className="h-5 w-5" />
            <span>알림</span>
          </button>
        </Link>
        <Link href="/mobile/mypage">
          <button className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-black">
            <User className="h-5 w-5" />
            <span>마이</span>
          </button>
        </Link>
      </div>
    </footer>
  );
}
