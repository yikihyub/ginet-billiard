import React from "react";

import Image from "next/image";
import { UserRound, MapPin } from "lucide-react";

interface BilliardGroupProps {
  title: string;
  location: string;
  currentMembers: number;
  maxMembers: number;
}

export function BilliardGroup({
  title,
  location,
  currentMembers,
  maxMembers,
}: BilliardGroupProps) {
  return (
    <div className="bg-white rounded-lg p-3 md:p-4 hover:shadow-lg transition-shadow border cursor-pointer">
      <div className="flex gap-4">
        <div className="relative w-[98px] h-[98px] md:w-[160px] md:h-[160px] overflow-hidden rounded-lg">
          <Image
            src="/logo/billard_web_banner.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-sm md:text-md text-ellipsis">
                {title}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex text-xs items-center">
                  <div>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>{location}</div>
                </div>
                <div className="flex text-xs  items-center">
                  <div>
                    <UserRound className="w-4 h-4" />
                  </div>
                  <div>
                    {currentMembers}/{maxMembers}명 참여중
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs md:text-sm">
              4구 중대
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs md:text-sm">
              3구 중대
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs md:text-sm">
              포켓볼
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
