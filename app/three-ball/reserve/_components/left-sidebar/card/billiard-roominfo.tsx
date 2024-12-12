"use client";

import { ChevronRight } from "lucide-react";

export function BilliardRoomInfo() {
  return (
    <div className="flex flex-col p-4 w-full justify-between">
      <div>
        <div className="text-lg font-semibold">두꺼비 당구장</div>
        <div className="text-md text-[#9fa6aa]">
          충남 당진시 북문로1길 41-17 3층
        </div>
      </div>
      <div className="flex text-sm">
        자세히 보기 <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
}
