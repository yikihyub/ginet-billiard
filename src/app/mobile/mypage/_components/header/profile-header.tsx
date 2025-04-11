'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ProfileHeader() {
  return (
    <div className="flex flex-col gap-5 bg-white p-4 shadow-sm">
      <div>
        <Link href="/mypage/profile">
          <div className="flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/profile.png" alt="프로필" />
              <AvatarFallback>UI</AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">지아이넷</span>
              </div>
              <div className="text-sm text-gray-500">ginet-korea@gmail.com</div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 flex-col rounded-md bg-gray-100 p-2">
          <div className="text-xs text-gray-600">3구</div>
          <div>20</div>
        </div>
        <div className="flex-1 flex-col rounded-md bg-gray-100 p-2">
          <div className="text-xs text-gray-600">4구</div>
          <div>250</div>
        </div>
      </div>
      <div className="relative aspect-[131/49] h-[70] w-full">
        <Image
          src="/ad/org1.png"
          alt="광고배너"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
