'use client';

import { UserRound } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { MembersTabProps } from '@/types/(club)/club';

export function MembersTab({
  staffMembers,
  members,
  memberCount,
  memberLimit,
}: MembersTabProps) {
  const [visibleMembers, setVisibleMembers] = useState(12);

  const loadMore = () => {
    setVisibleMembers((prev) => prev + 12);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">운영진</h3>
      </div>
      <div className="mt-3 space-y-3">
        {staffMembers &&
          staffMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 rounded-lg border p-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                {member.profileImage ? (
                  <Image
                    src={member.profileImage}
                    alt={`${member.name} 프로필`}
                    width={48}
                    height={48}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserRound className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-600">
                  {member.role} • {member.since}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="font-semibold">회원 목록</h3>
        <span className="text-sm text-gray-500">
          {memberCount}/{memberLimit}명
        </span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {members &&
          members.slice(0, visibleMembers).map((member) => (
            <div key={member.id} className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                {member.profileImage ? (
                  <Image
                    src={member.profileImage}
                    alt={`${member.name} 프로필`}
                    width={56}
                    height={56}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserRound className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <span className="mt-1 text-xs">{member.name}</span>
            </div>
          ))}
      </div>
      {visibleMembers < (members?.length || 0) && (
        <button
          onClick={loadMore}
          className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700"
        >
          더 보기
        </button>
      )}
    </div>
  );
}
