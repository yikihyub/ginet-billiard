'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker 등록 성공:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker 등록 실패:', error);
          });
      });
    }
  }, []);

  return null;
}
