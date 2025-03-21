'use client';

import { useState } from 'react';

const notices = [
  {
    id: 1,
    date: '2025-02-12',
    title: '고객센터 전화번호 변경 안내',
  },
  {
    id: 2,
    date: '2025-02-12',
    title: '안전 거래 정책 위반 행위에 대한 조사 및 제재 사항 안내',
  },
  {
    id: 3,
    date: '2025-02-05',
    title: '페이 결제 수단 제외 안내',
  },
  {
    id: 4,
    date: '2025-01-16',
    title: '2025 설 연휴 고객센터 휴무 및 배송/반품 일정 안내',
  },
  {
    id: 5,
    date: '2024-10-21',
    title: '개인정보 처리방침 개정 예정 안내 (시행일: 2024년 10월 23일)',
  },
  {
    id: 6,
    date: '2024-10-02',
    title: '개인정보 처리방침 개정 예정 안내 (시행일: 2024년 10월 10일)',
  },
];

export default function NoticeBoard() {
  const [activeTab, setActiveTab] = useState('공지사항');

  const tabs = ['공지사항', '자주 묻는 질문', '1:1 문의'];

  return (
    <div className="mx-auto h-screen w-full">
      {/* 탭 메뉴 */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-4 text-sm font-bold ${
              activeTab === tab
                ? 'border-b-2 border-green-500 bg-green-500 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {/* 공지사항 항목들 */}
        <div className="divide-y">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="flex h-20 cursor-pointer items-center py-4 hover:bg-gray-50"
            >
              <div className="flex-1 px-4 text-sm font-semibold">
                {notice.title}
              </div>
              <div className="w-32 px-4 text-right text-sm text-gray-500">
                {notice.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
