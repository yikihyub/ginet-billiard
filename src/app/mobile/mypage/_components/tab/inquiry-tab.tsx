'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function InquiryTab() {
  const pathname = usePathname();

  return (
    <div className="flex border-b">
      <Link
        href="/mobile/mypage/qna/my-inquiries"
        className={`flex-1 py-3 text-center ${
          pathname.includes('/my-inquiries')
            ? 'font-bold text-green-600'
            : 'text-gray-500'
        }`}
      >
        문의내역
      </Link>
      <Link
        href="/mobile/mypage/qna/inquiry"
        className={`flex-1 py-3 text-center ${
          pathname.includes('/inquiry')
            ? 'font-bold text-green-600'
            : 'text-gray-500'
        }`}
      >
        문의하기
      </Link>
    </div>
  );
}
