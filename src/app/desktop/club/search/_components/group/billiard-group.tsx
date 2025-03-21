import React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { UserRound, MapPin } from 'lucide-react';

interface BilliardGroupProps {
  id: string;
  title: string;
  location: string;
  description?: string;
  currentMembers: number;
  maxMembers: number;
  // tags?: string[];
  type: string;
}

export const BilliardGroup: React.FC<BilliardGroupProps> = ({
  id,
  title,
  location,
  description,
  currentMembers,
  maxMembers,
  // tags,
  type,
}) => {
  return (
    <Link href={`/club/search/${id}`}>
      <div className="cursor-pointer rounded-lg border bg-white p-3 transition-shadow hover:shadow-lg md:p-4">
        <div className="flex gap-4">
          <div className="relative h-[98px] w-[98px] overflow-hidden rounded-lg md:h-[160px] md:w-[160px]">
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
                <div className="md:text-md text-ellipsis text-sm font-semibold">
                  {title}
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center text-xs">
                    <div>
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>{location}</div>
                  </div>
                  <div className="flex items-center text-xs">
                    <div>
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      {currentMembers}/{maxMembers}명 참여중
                    </div>
                  </div>
                </div>
                <div>{description}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs md:text-sm">
                {type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
