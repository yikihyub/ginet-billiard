'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration =
            await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service Worker 등록 성공:', registration.scope);

          // 푸시 알림 권한 요청 (사용자가 앱을 처음 사용할 때만)
          if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            console.log('알림 권한 상태:', permission);
          }
        } catch (error) {
          console.error('Service Worker 등록 실패:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}
