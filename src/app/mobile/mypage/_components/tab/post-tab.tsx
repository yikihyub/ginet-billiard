'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PostTab() {
  const searchParams = useSearchParams();
  const currentPostTab = searchParams.get('post') ?? 'mypost'; // 기본값 설정 가능

  const tabClass = (tab: string) =>
    currentPostTab === tab
      ? 'font-bold text-green-600 border-b-2 border-green-600'
      : 'text-gray-500';

  return (
    <div className="flex border-b bg-white">
      <Link
        href="/mobile/mypage/latest-post?post=mypost"
        className={`flex-1 py-3 text-center ${tabClass('mypost')}`}
      >
        내가 쓴 글
      </Link>
      <Link
        href="/mobile/mypage/latest-post?post=mycomment"
        className={`flex-1 py-3 text-center ${tabClass('mycomment')}`}
      >
        나의 댓글
      </Link>
      <Link
        href="/mobile/mypage/latest-post?post=mylike"
        className={`flex-1 py-3 text-center ${tabClass('mylike')}`}
      >
        좋아요
      </Link>
    </div>
  );
}
