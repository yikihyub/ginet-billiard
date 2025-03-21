'use client';

import React, { useState } from 'react';

const NoticeBoard = () => {
  const [activeTab, setActiveTab] = useState('공지사항');

  const tabs = ['공지사항', '자주 묻는 질문', '1:1 문의'];

  const notices = [
    {
      id: 1,
      title: '[공지사항] 당구장 플랫펌 개인정보 처리방침 개정 안내',
      date: '2024-12-11',
    },
    {
      id: 2,
      title: '[공지사항] 당구장 플랫펌 개인정보 처리방침 개정 안내',
      date: '2023-11-14',
    },
    {
      id: 3,
      title: '[공지사항] Internet Explorer 11 지원 종료 안내',
      date: '2023-04-14',
    },
    {
      id: 4,
      title: "[공지사항] 당구장 플랫펌 '간편문의' 서비스 종료 예정 (12월5일)",
      date: '2022-11-28',
    },
  ];

  return (
    <div className="mx-auto w-full p-6">
      <h1 className="mb-12 mt-12 text-center text-3xl font-bold">
        {activeTab}
      </h1>

      {/* 상단 탭 메뉴 */}
      <div className="mb-8 flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-8 py-4 text-lg ${
              activeTab === tab
                ? 'border-b-2 border-black bg-black text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 공지사항 목록 */}
      <div>
        {/* 테이블 헤더 */}
        <div className="flex border-b py-4 font-medium">
          <div className="flex-1 px-4">제목</div>
          <div className="w-32 px-4 text-right">날짜</div>
        </div>

        {/* 공지사항 항목들 */}
        <div className="divide-y">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="flex cursor-pointer items-center py-4 hover:bg-gray-50"
            >
              <div className="flex-1 px-4">{notice.title}</div>
              <div className="w-32 px-4 text-right text-gray-500">
                {notice.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
