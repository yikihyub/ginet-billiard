// app/admin/analytics/user-activity/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

interface UserActivity {
  id: number;
  ip_address: string;
  user_id: number | null;
  username: string | null;
  visit_time: string;
  page_url: string | null;
  referer_url: string | null;
  browser: string | null;
  os: string | null;
  device_type: string | null;
  time_spent: number | null;
}

const UserActivityTracker: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchIP, setSearchIP] = useState('');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [filter, setFilter] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>(
    'all'
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  // 데이터 로드 함수
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/useractivity?ip=${searchIP}&startDate=${dateRange.start}&endDate=${dateRange.end}&filter=${filter}&page=${pagination.page}&limit=${pagination.limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setActivities(data.activities);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
      }));
    } catch (error) {
      console.error('Error loading user activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드 및 검색 조건 변경 시 재로드
  useEffect(() => {
    loadData();
  }, [pagination.page, filter]);

  // 검색 실행 핸들러
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadData();
  };

  // CSV 다운로드 핸들러
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(
        `/api/analytics/useractivity/export?ip=${searchIP}&startDate=${dateRange.start}&endDate=${dateRange.end}&filter=${filter}`
      );

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `user-activity-${searchIP || 'all'}-${dateRange.start}-${dateRange.end}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting user activity data:', error);
    }
  };

  // 페이지 URL 포맷팅
  const formatUrl = (url: string | null) => {
    if (!url) return '-';

    try {
      // URL에서 쿼리 파라미터 제거 (필요에 따라 조정)
      const urlObj = new URL(
        url.startsWith('http') ? url : `http://example.com${url}`
      );
      return urlObj.pathname;
    } catch (error) {
      console.log(error);
      return url;
    }
  };

  // 체류 시간 포맷팅
  const formatTimeSpent = (seconds: number | null) => {
    if (!seconds) return '-';

    if (seconds < 60) {
      return `${seconds}초`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}분 ${remainingSeconds}초`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">사용자 활동 추적</h1>
        <div className="mt-1 text-sm text-gray-500">IP별 페이지 방문 내역</div>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          {/* IP 주소 검색 */}
          <div className="flex min-w-[250px] flex-1 items-center rounded-md border">
            <div className="px-3 text-gray-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="IP 주소 검색"
              value={searchIP}
              onChange={(e) => setSearchIP(e.target.value)}
              className="w-full border-0 px-3 py-2 outline-none"
            />
          </div>

          {/* 날짜 범위 선택 */}
          <div className="flex items-center space-x-2">
            <div className="text-gray-500">
              <Calendar size={18} />
            </div>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="rounded-md border px-3 py-2"
            />
            <span>~</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="rounded-md border px-3 py-2"
            />
          </div>

          {/* 디바이스 타입 필터 */}
          <div className="flex items-center space-x-2">
            <div className="text-gray-500">
              <Filter size={18} />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="rounded-md border px-3 py-2"
            >
              <option value="all">모든 디바이스</option>
              <option value="desktop">데스크탑</option>
              <option value="mobile">모바일</option>
              <option value="tablet">태블릿</option>
            </select>
          </div>

          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            검색
          </button>

          {/* 내보내기 버튼 */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <Download size={18} className="mr-1" />
            CSV 내보내기
          </button>
        </div>
      </div>

      {/* 활동 내역 테이블 */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span className="ml-2">로딩 중...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            검색 조건에 맞는 활동 내역이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    IP 주소
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    디바이스
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    브라우저/OS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    방문 페이지
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    유입 경로
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    체류 시간
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(activity.visit_time).toLocaleString('ko-KR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {activity.ip_address}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {activity.username ||
                        `ID: ${activity.user_id || '비로그인'}`}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          activity.device_type === 'mobile'
                            ? 'bg-blue-100 text-blue-800'
                            : activity.device_type === 'tablet'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {activity.device_type || 'unknown'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {activity.browser} / {activity.os}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span
                        className="block max-w-md truncate"
                        title={activity.page_url || ''}
                      >
                        {formatUrl(activity.page_url)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span
                        className="block max-w-md truncate"
                        title={activity.referer_url || ''}
                      >
                        {activity.referer_url
                          ? formatUrl(activity.referer_url)
                          : '-'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatTimeSpent(activity.time_spent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {!isLoading && activities.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    page: Math.max(1, pagination.page - 1),
                  })
                }
                disabled={pagination.page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                이전
              </button>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={
                  pagination.page * pagination.limit >= pagination.total
                }
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                다음
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  전체 <span className="font-medium">{pagination.total}</span>{' '}
                  건 중{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  -{' '}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{' '}
                  번
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: Math.max(1, pagination.page - 1),
                      })
                    }
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    이전
                  </button>
                  {/* 페이지 번호 생성 */}
                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        Math.ceil(pagination.total / pagination.limit)
                      ),
                    },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() =>
                            setPagination({ ...pagination, page: pageNum })
                          }
                          className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                            pageNum === pagination.page
                              ? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page + 1,
                      })
                    }
                    disabled={
                      pagination.page * pagination.limit >= pagination.total
                    }
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    다음
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityTracker;
