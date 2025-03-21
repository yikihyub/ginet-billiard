'use client';

import Image from 'next/image';
import { Share2, Bell } from 'lucide-react';
import { ClubHeaderProps } from '@/types/(club)/club';

export default function ClubHeader({ clubData }: ClubHeaderProps) {
  return (
    <div className="relative h-56 w-full md:h-72">
      <Image
        src={clubData.bannerImage || '/logo/billard_web_banner.png'}
        alt={`${clubData.name} 배너 이미지`}
        fill
        className="object-cover"
      />
      <div className="absolute right-4 top-4 flex space-x-2">
        <button className="rounded-full bg-white/80 p-2 text-gray-700 backdrop-blur-sm">
          <Share2 className="h-5 w-5" />
        </button>
        <button className="rounded-full bg-white/80 p-2 text-gray-700 backdrop-blur-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
