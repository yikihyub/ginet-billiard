// lib/tracking.ts
'use client';

/**
 * 페이지 방문 추적을 위한 유틸리티 함수
 */

// 페이지 방문 이벤트 전송
export const trackPageView = async () => {
  try {
    if (typeof window === 'undefined') return;
    
    // 현재 페이지 정보
    const url = window.location.href;
    const title = document.title;
    const referrer = document.referrer;
    
    // 인증된 사용자 ID가 있다면 가져오기 (예: localStorage에서)
    // 이 부분은 인증 시스템에 맞게 수정 필요
    const userId = localStorage.getItem('userId');
    
    // 서버에 데이터 전송
    const response = await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        title,
        referrer,
        userId: userId ? parseInt(userId, 10) : undefined,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to track page view');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// 페이지 종료 이벤트 전송 (사용자가 페이지를 떠날 때)
export const trackPageExit = () => {
  // 페이지를 떠날 때 현재 시간 기록
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      // 비동기 요청이 완료되기 전에 페이지가 언로드될 수 있으므로
      // 간단한 방법으로 종료 시간 전송 (보낸 데이터가 화면 전환시 소실될 수 있음)
      const exitTime = new Date().toISOString();
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/exit', JSON.stringify({ 
          exitTime,
          url: window.location.href
        }));
      }
    });
  }
};

// 방문자 추적 초기화 함수
export const initTracking = () => {
  if (typeof window === 'undefined') return;
  
  // 현재 페이지 방문 추적
  trackPageView();
  
  // 페이지 종료 이벤트 리스너 설정
  trackPageExit();
  
  // 페이지 내 네비게이션 추적 (Next.js의 라우터 이벤트)
  if (typeof window !== 'undefined') {
    let lastPathname = window.location.pathname;
    
    // MutationObserver로 DOM 변경 감지 (URL 변경 감지)
    const observer = new MutationObserver(() => {
      const currentPathname = window.location.pathname;
      
      // 경로가 변경된 경우에만 추적
      if (currentPathname !== lastPathname) {
        lastPathname = currentPathname;
        trackPageView();
      }
    });
    
    // body 요소의 변경 감지
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};