'use client';
import { ClubNoticesProps } from '@/types/(club)/club';

export default function ClubNotices({ notices }: ClubNoticesProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return '오늘';
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return '1일 전';
    }

    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}일 전`;
  };

  return (
    <div className="mt-2 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">공지사항</h3>
        <button className="text-sm text-blue-500">더보기</button>
      </div>
      <div className="mt-3 space-y-2">
        {notices &&
          notices.slice(0, 2).map((notice) => (
            <div key={notice.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{notice.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{notice.content}</p>
                </div>
                <span className="ml-2 shrink-0 text-xs text-gray-500">
                  {formatDate(notice.date)}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
