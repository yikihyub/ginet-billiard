self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  return self.clients.claim();
});

// 푸시 알림을 받을 때 호출되는 이벤트 리스너
self.addEventListener('push', (event) => {
  if (!event.data) return;
  console.log('푸시 이벤트 수신:', event);
  try {
    const data = event.data.json();

    const options = {
      body: data.message || '새로운 알림이 있습니다.',
      icon: '/icons/notification-icon.png', // PWA 아이콘 경로 (아이콘 파일 필요)
      badge: '/icons/badge-icon.png', // 작은 아이콘 (없으면 제거해도 됨)
      data: {
        url: data.url || '/alert', // 알림 클릭 시 이동할 URL
        matchId: data.matchId,
        type: data.type,
      },
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
