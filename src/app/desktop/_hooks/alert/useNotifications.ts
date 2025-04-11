'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Notification } from '@/types/(alert)';

// 1. 폴링 방식의 알림 훅
export function useNotificationsPolling() {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/alert/getalert?userId=${userId}&limit=20`
      );

      if (!response.ok) {
        throw new Error('알림을 불러오는데 실패했습니다.');
      }

      const data = await response.json();

      if (data.success) {
        setNotifications(data.alerts);
        setUnreadCount(data.unreadCount);
      } else {
        throw new Error(data.error || '알림을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알림을 불러오는데 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = useCallback(async (alertId: number) => {
    try {
      const response = await fetch('/api/alert/read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId }),
      });

      if (response.ok) {
        // 알림 목록 업데이트
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === alertId
              ? { ...notification, status: 'read' }
              : notification
          )
        );
        // 안읽은 알림 수 업데이트
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('알림 읽음 표시 중 오류:', err);
    }
  }, []);

  // 페이지가 로드될 때와 일정 간격으로 알림 가져오기
  useEffect(() => {
    fetchNotifications();

    // 30초마다 새 알림 체크
    const intervalId = setInterval(fetchNotifications, 300000);

    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
  };
}
