'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { NotificationModal } from '../(alert)/notification-modal';

type NotificationType =
  | 'login'
  | 'match-request'
  | 'match-accepted'
  | 'match-rejected'
  | 'general';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ) => void;
  dismissNotification: () => void;
  hasUnread: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  const [notification, setNotification] = useState<Notification | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  // 기존 알림 확인
  useEffect(() => {
    if (!userId) return;
    const checkNotifications = async () => {
      try {
        const response = await fetch('/api/alert/unread');
        if (response.ok) {
          const data = await response.json();
          if (data.notifications && data.notifications.length > 0) {
            const latestNotification = data.notifications[0];
            setNotification({
              id: latestNotification.id,
              type: mapNotificationType(latestNotification.type),
              title: latestNotification.title,
              message: latestNotification.message,
              category: latestNotification.category,
              data: latestNotification.data,
            });
            setHasUnread(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    checkNotifications();
  }, []);

  // 실시간 알림 처리 (폴링 방식)
  useEffect(() => {
    if (!userId) return;
    const pollInterval = setInterval(async () => {
      if (!notification) {
        // 현재 표시 중인 알림이 없을 때만 새 알림 확인
        try {
          const response = await fetch('/api/alert/unread');
          if (response.ok) {
            const data = await response.json();
            if (data.notifications && data.notifications.length > 0) {
              const latestNotification = data.notifications[0];
              setNotification({
                id: latestNotification.id,
                type: mapNotificationType(latestNotification.type),
                title: latestNotification.title,
                message: latestNotification.message,
                category: latestNotification.category,
                data: latestNotification.data,
              });
              setHasUnread(true);
            }
          }
        } catch (error) {
          console.error('Failed to poll notifications:', error);
        }
      }
    }, 30000); // 30초마다 확인

    return () => clearInterval(pollInterval);
  }, [notification]);

  const mapNotificationType = (type: string | null): NotificationType => {
    if (!type) return 'general';

    switch (type.toUpperCase()) {
      case 'LOGIN':
        return 'login';
      case 'MATCH_REQUEST':
        return 'match-request';
      case 'MATCH_ACCEPTED':
        return 'match-accepted';
      case 'MATCH_REJECTED':
        return 'match-rejected';
      default:
        return 'general';
    }
  };

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ) => {
    setNotification({
      id: Date.now(),
      type,
      title,
      message,
      data,
    });
    setHasUnread(true);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, dismissNotification, hasUnread }}
    >
      {children}
      {notification && (
        <NotificationModal
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          data={notification.data}
          onDismiss={dismissNotification}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
}
