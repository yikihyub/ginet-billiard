'use client';

import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, Check, Calendar, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'unread' | 'read'
  >('all');

  // 알림 타입 맵핑
  const typeMapping: Record<
    string,
    { category: string; icon: React.ReactNode; color: string }
  > = {
    match_request: {
      category: '매칭',
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          🤝
        </div>
      ),
      color: 'bg-blue-100',
    },
    match_sent: {
      category: '매칭',
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
          📤
        </div>
      ),
      color: 'bg-indigo-100',
    },
    match_accepted: {
      category: '매칭',
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          ✅
        </div>
      ),
      color: 'bg-green-100',
    },
    match_rejected: {
      category: '매칭',
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          ❌
        </div>
      ),
      color: 'bg-red-100',
    },
    system: {
      category: '활동・소식',
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
          🔔
        </div>
      ),
      color: 'bg-purple-100',
    },
    event: {
      category: '혜택・이벤트',
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
          🎉
        </div>
      ),
      color: 'bg-yellow-100',
    },
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

  // 모든 알림 읽음 표시
  const markAllAsRead = async () => {
    if (!session?.user?.mb_id || alerts.length === 0) return;

    try {
      const response = await fetch('/api/alert/read-all', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.mb_id }),
      });

      if (!response.ok) {
        throw new Error('알림 상태 업데이트 중 오류가 발생했습니다');
      }

      // 모든 알림을 읽음으로 표시
      setAlerts((prev) => prev.map((alert) => ({ ...alert, status: 'read' })));

      toast({
        title: '알림 읽음 처리 완료',
        description: '모든 알림이 읽음 처리되었습니다',
      });
    } catch (error) {
      console.error('알림 읽음 처리 오류:', error);
      toast({
        title: '알림 읽음 처리 실패',
        description: '알림 상태 업데이트 중 오류가 발생했습니다',
        variant: 'destructive',
      });
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
      return format(date, 'yyyy년 M월 d일', { locale: ko });
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

  // 필터링된 알림
  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === 'unread') return alert.status === 'unread';
    if (selectedFilter === 'read') return alert.status === 'read';
    return true;
  });

  // 읽지 않은 알림 개수
  const unreadCount = alerts.filter(
    (alert) => alert.status === 'unread'
  ).length;

  return (
    <div className="">
      {/* header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          알림
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="mr-1 h-4 w-4" />
                  모두 읽음
                </Button>
              </TooltipTrigger>
              <TooltipContent>모든 알림을 읽음 처리합니다</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-1 h-4 w-4" />
                {selectedFilter === 'all' && '모든 알림'}
                {selectedFilter === 'unread' && '읽지 않은 알림'}
                {selectedFilter === 'read' && '읽은 알림'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                모든 알림
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('unread')}>
                읽지 않은 알림
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('read')}>
                읽은 알림
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchAlerts}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b bg-gray-50 px-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
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
        ) : filteredAlerts.length === 0 ? (
          <div className="flex items-center justify-center p-16">
            <div className="text-center">
              <p className="mb-2 text-4xl">🔔</p>
              <p className="text-gray-500">
                {selectedFilter === 'all'
                  ? '알림이 없습니다'
                  : selectedFilter === 'unread'
                    ? '읽지 않은 알림이 없습니다'
                    : '읽은 알림이 없습니다'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* 날짜별 그룹화를 위한 코드 */}
            {(() => {
              const groupedByDate: Record<string, Alert[]> = {};

              filteredAlerts.forEach((alert) => {
                const date = new Date(alert.created_at);
                let dateKey;

                if (isToday(date)) {
                  dateKey = '오늘';
                } else if (isYesterday(date)) {
                  dateKey = '어제';
                } else {
                  dateKey = format(date, 'yyyy년 M월 d일', { locale: ko });
                }

                if (!groupedByDate[dateKey]) {
                  groupedByDate[dateKey] = [];
                }

                groupedByDate[dateKey].push(alert);
              });

              return Object.entries(groupedByDate).map(
                ([dateKey, dateAlerts]) => (
                  <div key={dateKey}>
                    <div className="sticky top-0 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dateKey}
                      </div>
                    </div>
                    <div className="divide-y">
                      {dateAlerts.map((alert) => {
                        const alertType = typeMapping[alert.type] || {
                          category: '활동・소식',
                          icon: (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                              🔔
                            </div>
                          ),
                          color: 'bg-gray-100',
                        };

                        return (
                          <div
                            key={alert.id}
                            className={`relative cursor-pointer p-6 hover:bg-gray-50 ${
                              alert.status === 'unread' ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleAlertClick(alert)}
                          >
                            <div className="flex items-start gap-4">
                              {alertType.icon}
                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex w-full items-center justify-between">
                                  <span className="text-lg font-semibold">
                                    {alert.title}
                                  </span>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatTime(alert.created_at)}</span>
                                  </div>
                                </div>
                                <p className="mt-2 text-gray-700">
                                  {alert.message}
                                </p>
                                <div className="mt-2">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${alertType.color} text-gray-800`}
                                  >
                                    {alertType.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {alert.status === 'unread' && (
                              <div className="absolute right-6 top-6 h-3 w-3 rounded-full bg-red-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              );
            })()}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
