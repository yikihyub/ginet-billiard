'use client';

import React, { useState } from 'react';
import { useNotificationsPolling } from '@/hooks/alert/useNotifications';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotificationDropdown() {
  const router = useRouter();

  const { notifications, unreadCount, loading, markAsRead } =
    useNotificationsPolling();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification: any) => {
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }

    // 알림 유형에 따라 다른 처리
    if (notification.type === 'match_request') {
      // 매치 요청 페이지로 이동 등의 처리
      // window.location.href = '/match/requests';
    }

    setIsOpen(false);
  };

  return (
    <>
      <div className="relative cursor-pointer md:hidden">
        <Link href="/alert">
          <Bell />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-white"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Link>
      </div>
      <div className="hidden md:block">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <Bell />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-white"
                  variant="destructive"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="border-b p-2 text-center font-semibold">알림</div>
            <div className="max-h-96 overflow-auto">
              {loading && (
                <div className="p-4 text-center text-gray-500">로딩 중...</div>
              )}

              {!loading && notifications.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  새로운 알림이 없습니다.
                </div>
              )}

              {!loading &&
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`cursor-pointer border-b p-3 last:border-0 ${
                      notification.status === 'unread' ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-600">
                        {notification.message}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {format(
                          new Date(notification.created_at),
                          'yyyy년 MM월 dd일 HH:mm',
                          { locale: ko }
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
            </div>
            {notifications.length > 0 && (
              <div className="border-t p-2 text-center">
                <Link
                  href="/mypage/alert"
                  className="text-sm text-blue-500 hover:underline"
                >
                  모든 알림 보기
                </Link>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
