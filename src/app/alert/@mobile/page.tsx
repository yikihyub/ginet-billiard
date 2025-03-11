'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';
import PushNotificationButton from '../_components/button/push-notification-button';

// 알림 타입 정의
type Alert = {
  id: number;
  title: string;
  message: string;
  type: string;
  status: 'read' | 'unread';
  created_at: string;
};

export default function AlertPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('전체');
  const tabs = ['전체', '매칭', '활동・소식', '혜택・이벤트'];
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 알림 타입 맵핑
  const typeMapping: Record<string, { category: string; icon: string }> = {
    match_request: { category: '매칭', icon: '🤝' },
    match_sent: { category: '매칭', icon: '📤' },
    match_accepted: { category: '매칭', icon: '✅' },
    match_rejected: { category: '매칭', icon: '❌' },
    system: { category: '활동・소식', icon: '🔔' },
    event: { category: '혜택・이벤트', icon: '🎉' },
  };

  // 알림 가져오기
  const fetchAlerts = async () => {
    if (!session?.user?.mb_id) return;

    try {
      setIsLoading(true);

      // 카테고리별 필터링
      let apiUrl = `/api/alert/getalert?userId=${session.user.mb_id}`;
      if (activeTab !== '전체') {
        apiUrl += `?category=${encodeURIComponent(activeTab)}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('알림을 불러오는 중 오류가 발생했습니다');
      }

      const data = await response.json();

      if (data.success) {
        setAlerts(data.alerts || []);
      } else {
        throw new Error(data.error || '알림을 불러오는 중 오류가 발생했습니다');
      }
    } catch (error) {
      console.error('알림 로딩 오류:', error);
      toast({
        title: '알림 로딩 실패',
        description:
          error instanceof Error
            ? error.message
            : '알림을 불러오는 중 오류가 발생했습니다',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 알림 읽음 표시
  const markAsRead = async (alertId: number) => {
    try {
      const response = await fetch('/api/alert/read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId }),
      });

      if (!response.ok) {
        throw new Error('알림 상태 업데이트 중 오류가 발생했습니다');
      }

      // 알림 목록 업데이트
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: 'read' } : alert
        )
      );
    } catch (error) {
      console.error('알림 읽음 처리 오류:', error);
    }
  };

  // 탭 변경 시 알림 재로딩
  useEffect(() => {
    if (session?.user?.mb_id) {
      fetchAlerts();
    }
  }, [session, activeTab]);

  // 시간 형식 변환
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, 'a h:mm', { locale: ko });
    } else if (isYesterday(date)) {
      return '어제';
    } else {
      return format(date, 'M월 d일', { locale: ko });
    }
  };

  // 알림 클릭 핸들러
  const handleAlertClick = (alert: Alert) => {
    // 읽지 않은 알림이면 읽음 처리
    if (alert.status === 'unread') {
      markAsRead(alert.id);
    }

    // 알림 타입에 따른 처리
    switch (alert.type) {
      case 'match_request':
        // 매치 요청 페이지로 이동
        // window.location.href = '/match/requests';
        break;
      case 'match_sent':
        // 보낸 매치 요청 페이지로 이동
        // window.location.href = '/match/sent';
        break;
      case 'match_accepted':
        // 수락된 매치 페이지로 이동
        // window.location.href = '/match/active';
        break;
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white shadow-sm">
      <PushNotificationButton />

      {/* 탭 메뉴 */}
      <div className="flex items-center justify-between border-b px-4">
        <div className="no-scrollbar flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-3 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 font-medium text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchAlerts}
          disabled={isLoading}
          className="h-8 w-8"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* 알림 목록 */}
      <ScrollArea className="h-[600px]">
        {isLoading && alerts.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
              <p className="text-gray-500">알림을 불러오는 중...</p>
            </div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex items-center justify-center p-16">
            <div className="text-center">
              <p className="mb-2 text-2xl">🔔</p>
              <p className="text-gray-500">알림이 없습니다</p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {alerts.map((alert) => {
              const alertType = typeMapping[alert.type] || {
                category: '활동・소식',
                icon: '🔔',
              };

              return (
                <div
                  key={alert.id}
                  className={`relative cursor-pointer p-4 hover:bg-gray-50 ${
                    alert.status === 'unread' ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-2xl">
                      {alertType.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex w-full items-center justify-between">
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-sm font-bold">
                            {alert.title}
                          </span>

                          <span className="text-sm text-gray-400">
                            {formatTime(alert.created_at)}
                          </span>
                        </div>
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(alert.id);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button> */}
                      </div>
                      <p className="mb-1 text-xs text-gray-900">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  {alert.status === 'unread' && (
                    <div className="absolute right-12 top-4 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
