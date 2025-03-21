'use client';

import { ClubInfoProps } from '@/types/(club)/club';
import { MapPin, UserRound, Calendar, Clock, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ClubInfo({ clubData, clubId, isAdmin }: ClubInfoProps) {
  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex w-full flex-col items-start justify-between">
        <div className="mb-2 flex w-full justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            {clubData.name}
          </h2>
          {isAdmin && (
            <div className="flex items-center justify-center gap-2">
              <Link href={`/club/search/${clubId}/admin`}>
                <button className="hover:bg-gray ml-2 flex items-center gap-1 rounded bg-gray-200 px-3 py-2 transition">
                  <div className="font-semibold text-[#727272]">수정하기 </div>
                  <Edit className="h-6 w-6 text-gray-600" />
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{clubData.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserRound className="h-4 w-4" />
            <span className="text-sm">
              {clubData.memberCount}/{clubData.memberLimit}명
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{clubData.meetingSchedule}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">설립 {clubData.establishedYear}년</span>
          </div>
        </div>
      </div>

      {/* 태그 */}
      <div className="mt-3 flex flex-wrap gap-2">
        {clubData.tags &&
          clubData.tags.map((tag, index) => (
            <span
              key={index}
              className={`rounded-full ${
                tag.type === 'activity'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-green-50 text-green-600'
              } px-3 py-1 text-sm`}
            >
              {tag.name}
            </span>
          ))}
      </div>
    </div>
  );
}
