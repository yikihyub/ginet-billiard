import React from 'react';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export default async function NoticeBoard() {
  const notices = await prisma.bi_notice.findMany({
    orderBy: { date: 'desc' },
  });

  return (
    <div className="mx-auto w-full">
      <>
        {notices.map((notice) => (
          <Link
            href={`/mobile/notice/${notice.id}`}
            key={notice.id}
            className="flex h-24 flex-col items-start justify-center gap-1 border-b border-[#F8F8F8] hover:bg-gray-50"
          >
            <div className="px-4 text-sm font-semibold text-[#207A24]">
              &#91;{notice.category}&#93;
            </div>
            <div className="px-4 text-sm">{notice.title}</div>
            <div className="px-4 text-right text-xs text-gray-500">
              {format(new Date(notice.date), 'yyyy. MM. dd')}
            </div>
          </Link>
        ))}
      </>
    </div>
  );
}
