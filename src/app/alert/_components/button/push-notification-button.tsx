'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

import { BellIcon, BellOff } from 'lucide-react';

export default function PushNotificationButton() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );

  console.log(permission);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 알림 권한 상태 확인
    if (typeof window !== 'undefined') {
      setPermission(Notification.permission);
    }

    // 사용자의 푸시 알림 활성화 상태 확인 (API 호출하여 확인 가능)
    const checkPushStatus = async () => {
      try {
        const response = await fetch(`/api/push/status?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setIsEnabled(data.data.push_enabled);
        }
      } catch (error) {
        console.error('푸시 상태 확인 중 오류:', error);
      }
    };

    checkPushStatus();
  }, [userId]);

  const enablePushNotifications = async () => {
    setIsLoading(true);

    try {
      // 1. 알림 권한 요청
      if (Notification.permission !== 'granted') {
        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);

        if (permissionResult !== 'granted') {
          toast({
            title: '알림 권한 거부됨',
            description:
              '알림을 받으려면 브라우저 설정에서 알림 권한을 허용해주세요.',
            variant: 'destructive',
          });
          return;
        }
      }

      // 2. 서비스 워커 등록 확인
      let swRegistration =
        await navigator.serviceWorker.getRegistration('/service-worker.js');

      if (!swRegistration) {
        swRegistration =
          await navigator.serviceWorker.register('/service-worker.js');
      }

      // 3. 푸시 알림 구독
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      // 4. 서버에 구독 정보 전송
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('서버에 구독 정보 저장 실패');
      }

      setIsEnabled(true);
      toast({
        title: '알림 활성화',
        description: '푸시 알림이 성공적으로 활성화되었습니다.',
        variant: 'default',
      });
    } catch (error) {
      console.error('푸시 알림 활성화 중 오류:', error);
      toast({
        title: '알림 설정 오류',
        description: '알림 설정을 변경하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disablePushNotifications = async () => {
    setIsLoading(true);

    try {
      // 1. 서비스 워커 등록 확인
      const registration =
        await navigator.serviceWorker.getRegistration('/service-worker.js');

      if (registration) {
        // 2. 구독 정보 가져오기
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          // 3. 구독 해제
          await subscription.unsubscribe();
        }
      }

      // 4. 서버에 구독 해제 정보 전송
      const response = await fetch('/api/push/disable', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('서버에 구독 해제 정보 저장 실패');
      }

      setIsEnabled(false);
      toast({
        title: '알림 비활성화',
        description: '푸시 알림이 비활성화되었습니다.',
        variant: 'default',
      });
    } catch (error) {
      console.error('푸시 알림 비활성화 중 오류:', error);
      toast({
        title: '알림 설정 오류',
        description: '알림 설정을 변경하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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

  return (
    <>
      <Button
        variant={isEnabled ? 'default' : 'outline'}
        size="sm"
        disabled={isLoading || permission === 'denied'}
        onClick={isEnabled ? disablePushNotifications : enablePushNotifications}
        className="gap-2"
      >
        {isEnabled ? (
          <>
            <BellIcon className="h-4 w-4" />
            알림 켜짐
          </>
        ) : (
          <>
            <BellOff className="h-4 w-4" />
            알림 꺼짐
          </>
        )}
      </Button>
      {permission === 'denied' && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            알림 권한이 차단되어 있습니다. 브라우저 설정에서 알림 권한을
            허용해주세요.
            <Button
              variant="link"
              className="h-auto p-0 font-medium"
              onClick={() => {
                // 대부분의 브라우저에서는 작동하지 않을 수 있으나, 크롬에서는 일부 지원
                window.open('chrome://settings/content/notifications');
                window.open('about:preferences#privacy');
              }}
            >
              브라우저 설정으로 이동
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
