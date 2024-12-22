"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BilliardRoomInfoProps {
  id: string; // 당구장 고유 ID
}

export function BilliardRoomInfo({ id }: BilliardRoomInfoProps) {
  return (
    <div className="flex flex-col p-2 w-full justify-between">
      <div>
        <div className="text-lg font-semibold">두꺼비 당구장</div>
        <div className="text-sm text-[#9fa6aa]">
          충남 당진시 북문로1길 41-17 3층
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
            4구
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
            3구
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
            포켓볼
          </span>
        </div>
        <div>
          <Link
            href={`/three-ball/detail/${id}`}
            className="flex text-sm items-center hover:text-blue-500 transition-colors"
          >
            자세히 보기 <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
