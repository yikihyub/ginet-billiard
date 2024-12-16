"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function ProfileHeader() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className={`px-6 py-4 flex ${
        isMobile ? "flex-col gap-4" : "items-center justify-between"
      } border-b`}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/profile.png" alt="프로필" />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-medium">지아이넷</span>
            <span className="text-gray-400">{">"}</span>
          </div>
          <div className="text-sm text-gray-500">ginet-korea@gmail.com</div>
        </div>
      </div>

      <div
        className={`flex ${
          isMobile ? "justify-between" : ""
        } items-center gap-6`}
      >
        <div className="text-center">
          <p className="text-sm text-gray-600">쿠폰</p>
          <p className="font-bold">25</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">캐시</p>
          <p className="font-bold">0</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
          구독하기
        </button>
      </div>
    </div>
  );
}
