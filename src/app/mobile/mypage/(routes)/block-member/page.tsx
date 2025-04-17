import React from 'react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { redirect } from 'next/navigation';
import BlockedButton from '../../_components/button/blocked-button';
import BlockHeader from '../../_components/header/block-header';

export default async function BlockMemberPage() {
  const session = await getServerSession(authOptions);

  // 로그인 안 된 경우 로그인 페이지로 리디렉트
  if (!session) {
    return redirect('/login');
  }

  const currentUserId = session.user.mb_id;

  // 현재 사용자가 차단한 사용자 목록 불러오기
  const blockedUsers = await prisma.bi_user_block.findMany({
    where: {
      blocker_id: currentUserId!,
      is_active: true,
    },
    include: {
      bi_user_bi_user_block_blocked_idTobi_user: {
        select: {
          mb_id: true,
          name: true,
        },
      },
    },
    orderBy: {
      block_date: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <BlockHeader />
      {blockedUsers.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-500">
          차단한 사용자가 없습니다.
        </p>
      ) : (
        <ul className="border-b border-t px-2">
          {blockedUsers.map((block) => {
            const user = block.bi_user_bi_user_block_blocked_idTobi_user;
            return (
              <li
                key={block.block_id}
                className="flex items-center justify-between rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-400">
                      차단일: {new Date(block.block_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <BlockedButton blockedId={user.mb_id!} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
