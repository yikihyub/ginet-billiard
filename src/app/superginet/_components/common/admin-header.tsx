'use client';

import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Settings, Menu } from 'lucide-react';

interface AdminHeaderProps {
  toggleSidebar: () => void;
  username?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  toggleSidebar,
  username = '관리자',
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: '새로운 회원 가입 요청', time: '3분 전', read: false },
    {
      id: 2,
      message: '신고된 게시물이 있습니다',
      time: '25분 전',
      read: false,
    },
    { id: 3, message: '시스템 업데이트 완료', time: '1시간 전', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      {/* 왼쪽: 햄버거 메뉴와 로고 */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleSidebar}
          className="mr-4 rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu size={24} />
        </button>
        <div className="text-xl font-bold text-blue-600">당구장 관리자</div>
      </div>

      {/* 오른쪽: 검색, 알림, 프로필 */}
      <div className="flex items-center space-x-4">
        {/* 검색 */}
        <div className="hidden items-center rounded-md bg-gray-100 px-3 py-2 md:flex">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="검색"
            className="ml-2 w-40 border-none bg-transparent focus:outline-none"
          />
        </div>

        {/* 알림 */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* 알림 드롭다운 */}
          {showNotifications && (
            <div className="absolute right-0 z-10 mt-2 w-72 rounded-md border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-3 font-medium">
                알림
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-b border-gray-100 p-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="text-sm">{notification.message}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {notification.time}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    알림이 없습니다
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 p-2 text-center">
                <button className="text-sm text-blue-500 hover:underline">
                  모든 알림 확인하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 프로필 */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
              <User size={16} />
            </div>
            <span className="hidden font-medium md:inline">{username}</span>
          </button>

          {/* 프로필 드롭다운 */}
          {showProfileMenu && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-3">
                <div className="font-medium">{username}</div>
                <div className="text-xs text-gray-500">최고 관리자</div>
              </div>
              <div className="py-1">
                <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100">
                  <Settings size={16} className="mr-2" />
                  설정
                </button>
                <button className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
                  <LogOut size={16} className="mr-2" />
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
