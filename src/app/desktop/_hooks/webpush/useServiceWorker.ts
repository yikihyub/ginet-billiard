'use client';

import { useState, useEffect } from 'react';

export function useServiceWorker() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    ) {
      // 현재 권한 상태 확인
      setPermission(Notification.permission);

      // Service Worker 등록
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker 등록 성공:', registration.scope);
          setIsRegistered(true);

          // 현재 구독 상태 확인
          return registration.pushManager.getSubscription();
        })
        .then((existingSubscription) => {
          setSubscription(existingSubscription);
        })
        .catch((error) => {
          console.error('Service Worker 등록 실패:', error);
        });
    }
  }, []);

  // 알림 권한 요청 함수
  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined') return null;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission;
    } catch (error) {
      console.error('알림 권한 요청 중 오류 발생:', error);
      return null;
    }
  };

  // 푸시 알림 구독 함수
  const subscribeToPushNotifications = async () => {
    if (
      !isRegistered ||
      permission !== 'granted' ||
      typeof window === 'undefined'
    ) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // 서버 공개 키 (실제 구현 시 환경 변수나 API를 통해 가져와야 함)
      const publicVapidKey = 'YOUR_PUBLIC_VAPID_KEY';

      // 기존 구독이 있으면 해제
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      // 새로운 구독 생성
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      setSubscription(newSubscription);

      // 서버에 구독 정보 전송 (실제 구현 시 API 호출 필요)
      // await saveSubscription(newSubscription);

      return newSubscription;
    } catch (error) {
      console.error('푸시 알림 구독 중 오류 발생:', error);
      return null;
    }
  };

  // Base64 문자열을 Uint8Array로 변환하는 유틸리티 함수
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return {
    isRegistered,
    subscription,
    permission,
    requestNotificationPermission,
    subscribeToPushNotifications,
  };
}
