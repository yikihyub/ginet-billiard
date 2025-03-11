self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  return self.clients.claim();
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.message || '새로운 알림이 있습니다.',
      icon: '/logo/notification-icon.png', // 알림 아이콘 (192x192px 권장)
      badge: '/logo/badge-icon.png', // 작은 아이콘 (모바일용, 72x72px 권장)
      image: '/images/hero-image.jpg', // 큰 이미지 (알림에 표시)
      vibrate: [100, 50, 100], // 진동 패턴 (모바일)
      tag: data.type || 'default', // 알림 그룹화 태그
      actions: [
        // 액션 버튼 (최대 2개)
        {
          action: 'view',
          title: '확인하기',
          icon: '/icons/view-icon.png',
        },
        {
          action: 'dismiss',
          title: '닫기',
          icon: '/icons/dismiss-icon.png',
        },
      ],
      data: {
        url: data.url || '/notifications',
        matchId: data.matchId,
        type: data.type,
      },
      requireInteraction: true, // 사용자가 상호작용할 때까지 알림 유지
      silent: false, // 소리 재생 여부
      timestamp: data.timestamp || Date.now(), // 알림 타임스탬프
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '알림', options)
    );
  } catch (error) {
    console.error('푸시 알림 처리 중 오류 발생:', error);
  }
});

// 알림 클릭 시 호출되는 이벤트 리스너
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

self.addEventListener('push', (event) => {
  try {
    // 먼저 수신된 데이터 로그 확인
    console.log(
      '수신된 원본 데이터:',
      event.data ? event.data.text() : 'No data'
    );

    let data;
    if (event.data) {
      try {
        // JSON 파싱 시도
        data = event.data.json();
      } catch (e) {
        // JSON 파싱 실패 시 텍스트로 처리
        console.log('JSON 파싱 실패, 텍스트로 처리:', e);
        const text = event.data.text();
        data = {
          title: '새 알림',
          message: text,
          url: '/alert',
        };
      }
    } else {
      // 데이터가 없는 경우 기본값 사용
      data = {
        title: '새 알림',
        message: '새로운 알림이 있습니다',
      };
    }

    // 알림 옵션 설정
    const options = {
      body: data.message || '새로운 알림이 있습니다.',
      icon: '/icon.png',
      data: {
        url: data.url || '/alert',
        matchId: data.matchId,
      },
    };

    // 알림 표시
    event.waitUntil(
      self.registration.showNotification(data.title || '알림', options)
    );
  } catch (error) {
    console.error('푸시 알림 처리 중 오류 발생:', error);

    // 오류 발생시 기본 알림 표시
    event.waitUntil(
      self.registration.showNotification('새 알림', {
        body: '새로운 알림이 도착했습니다.',
        icon: '/icon.png',
        data: { url: '/alert' },
      })
    );
  }
});
