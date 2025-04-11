'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// 팝업 데이터 타입 정의
type Popup = {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  link_url?: string;
  width: number;
  height: number;
  position: string;
  show_once: boolean;
};

// 팝업 컴포넌트 속성
interface PopupProps {
  popup: Popup;
  onClose: (id: string) => void;
}

// 단일 팝업 컴포넌트
const PopupItem = ({ popup, onClose }: PopupProps) => {
  // 위치에 따른 스타일 계산
  const positionStyles = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={cn(
        'fixed z-50 overflow-hidden rounded-lg bg-white shadow-lg',
        positionStyles[popup.position as keyof typeof positionStyles]
      )}
      style={{
        width: `${popup.width}px`,
        height: `${popup.height}px`,
      }}
    >
      {/* 팝업 헤더 */}
      <div className="flex items-center justify-between border-b p-3">
        <h3 className="text-base font-medium">{popup.title}</h3>
        <button
          onClick={() => onClose(popup.id)}
          className="text-gray-500 transition-colors hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 팝업 콘텐츠 */}
      <div className="relative h-[calc(100%-60px)]">
        {popup.image_url && (
          <img
            src={popup.image_url}
            alt={popup.title}
            className="h-full w-full object-cover"
          />
        )}

        <div
          className={cn(
            'p-4',
            popup.image_url ? 'absolute inset-0 bg-black/30' : ''
          )}
        >
          <div
            className={cn(
              'prose max-w-none',
              popup.image_url ? 'text-white' : 'text-gray-800'
            )}
          >
            <div dangerouslySetInnerHTML={{ __html: popup.content }} />
          </div>

          {popup.link_url && (
            <div className="absolute bottom-4 right-4">
              <a
                href={popup.link_url}
                className="rounded bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                target="_blank"
                rel="noopener noreferrer"
              >
                자세히 보기
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PopupManagerProps {
  location?: 'client' | 'admin' | 'both';
}

// 팝업 관리자 컴포넌트
const PopupManager: React.FC<PopupManagerProps> = ({ location = 'client' }) => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [closedPopups, setClosedPopups] = useState<string[]>([]);

  // 팝업 불러오기
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const response = await fetch('/api/popup');
        const data = await response.json();
        const filteredPopups = data.filter(
          (popup: any) =>
            popup.display_on === location || popup.display_on === 'both'
        );

        setPopups(filteredPopups);
      } catch (error) {
        console.error('팝업을 불러오는데 실패했습니다:', error);
      }
    };

    fetchPopups();
  }, [location]);

  // 로컬스토리지에서 이전에 닫은 팝업 ID 불러오기
  useEffect(() => {
    const savedClosedPopups = localStorage.getItem('closedPopups');
    if (savedClosedPopups) {
      setClosedPopups(JSON.parse(savedClosedPopups));
    }
  }, []);

  // 팝업 닫기 핸들러
  const handleClosePopup = (id: string) => {
    const popup = popups.find((p) => p.id === id);

    // 1회만 표시하는 팝업인 경우 로컬스토리지에 저장
    if (popup?.show_once) {
      const updatedClosedPopups = [...closedPopups, id];
      setClosedPopups(updatedClosedPopups);
      localStorage.setItem('closedPopups', JSON.stringify(updatedClosedPopups));
    }

    // UI에서 팝업 제거
    setPopups(popups.filter((p) => p.id !== id));
  };

  // 표시할 팝업 필터링: 이미 닫은 1회성 팝업은 제외
  const visiblePopups = popups.filter(
    (popup) => !(popup.show_once && closedPopups.includes(popup.id))
  );

  if (visiblePopups.length === 0) {
    return null;
  }

  return (
    <>
      {visiblePopups.map((popup) => (
        <PopupItem key={popup.id} popup={popup} onClose={handleClosePopup} />
      ))}
    </>
  );
};

export default PopupManager;
