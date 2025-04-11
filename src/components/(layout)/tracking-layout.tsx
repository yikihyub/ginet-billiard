'use client';

import { useEffect } from 'react';
import { initTracking } from '@/lib/tracking';

/**
 * 방문자 추적을 위한 레이아웃 컴포넌트
 * - _app.tsx 또는 레이아웃 컴포넌트에 포함시켜 사용
 */
export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 브라우저 환경에서만 추적 초기화
    if (typeof window !== 'undefined') {
      initTracking();
    }
  }, []);

  return <>{children}</>;
}
