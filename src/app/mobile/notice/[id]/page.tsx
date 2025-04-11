'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
}

export default function NoticeDetailPage() {
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevNext, setPrevNext] = useState<{
    prev?: NoticeDetail;
    next?: NoticeDetail;
  }>({});

  const router = useRouter();
  const params = useParams();

  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    async function fetchNotice() {
      try {
        const response = await fetch(`/api/notices/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/mobile/notice');
            return;
          }
          throw new Error('Failed to fetch notice');
        }

        const data = await response.json();
        setNotice({
          id: data.id,
          category: data.category,
          title: data.title,
          content: data.content,
          date: format(new Date(data.date), 'yyyy-MM-dd'),
        });

        const adjacent = await fetch(`/api/notices/prev-next?id=${id}`);
        const adjacentData = await adjacent.json();
        setPrevNext(adjacentData);
      } catch (error) {
        console.error('Error fetching notice:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotice();
  }, [id, router]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="mb-6 h-4 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <div className="mt-6">
          <Skeleton className="mx-auto h-10 w-24" />
        </div>
      </div>
    );
  }

  if (!notice) return null;

  return (
    <div className="p-4">
      <div className="text-sm font-semibold text-[#207A24]">
        &#91;{notice.category}&#93;
      </div>
      <h1 className="mb-2 text-xl font-bold">{notice.title}</h1>
      <p className="mb-6 text-sm text-gray-500">{notice.date}</p>
      <div className="mb-6 border-b"></div>
      {/* HTML 콘텐츠 렌더링 */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />
      <div className="mt-6 flex w-full flex-col gap-2 border-t py-4 text-sm text-gray-700">
        {prevNext.prev ? (
          <div
            className="flex justify-between"
            onClick={() => router.push(`/mobile/notice/${prevNext.prev?.id}`)}
          >
            <div className="flex items-center text-gray-400">
              <div>
                <ChevronUp />
              </div>
              <div>이전글</div>
            </div>
            <div className="text-right text-green-600 hover:underline">
              {prevNext.prev?.title}
            </div>
          </div>
        ) : (
          <div className="text-gray-400">이전글이 없습니다</div>
        )}
        {prevNext.next ? (
          <div
            className="flex justify-between"
            onClick={() => router.push(`/mobile/notice/${prevNext.next?.id}`)}
          >
            <div className="flex items-center text-gray-400">
              <div>
                <ChevronDown />
              </div>
              <div>다음글</div>
            </div>
            <div className="text-right text-green-600 hover:underline">
              {prevNext.next?.title}
            </div>
          </div>
        ) : (
          <div className="text-gray-400">다음글이 없습니다</div>
        )}
      </div>
    </div>
  );
}
