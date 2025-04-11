'use client';

import React, { useState, useEffect } from 'react';
import LiveVisitorsCard from '../_components/statistics/live-visitors-card';
import VisitorsChart from '../_components/statistics/visitors-chart';
import DeviceBreakdown from '../_components/statistics/device-break-down';
import PageViewsTable from '../_components/statistics/page-view-table';

const VisitorsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<
    'today' | 'week' | 'month' | 'custom'
  >('today');
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    currentVisitors: 0,
    totalToday: 0,
    peakToday: 0,
    visitorsByTime: [],
    deviceStats: [],
    popularPages: [],
  });

  // 데이터 로드 함수
  const loadData = async () => {
    setIsLoading(true);
    try {
      // API 호출로 데이터 가져오기
      const response = await fetch(
        `/api/analytics/visitors?range=${timeRange}`
      );
      const data = await response.json();
      setStatsData(data);
    } catch (error) {
      console.error('Failed to load visitor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // 실시간 접속자 데이터를 위한 인터벌 설정
    const interval = setInterval(() => {
      updateCurrentVisitors();
    }, 300000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, [timeRange]);

  // 실시간 접속자 수만 업데이트하는 함수
  const updateCurrentVisitors = async () => {
    try {
      const response = await fetch('/api/analytics/currentvisitors');
      const data = await response.json();
      setStatsData((prev) => ({
        ...prev,
        currentVisitors: data.count,
      }));
    } catch (error) {
      console.error('Failed to update current visitors:', error);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">접속자 현황</h1>
        <div className="mt-1 text-sm text-gray-500">
          홈 &gt; 통계 &gt; 접속자 현황
        </div>
      </div>

      {/* 시간대 선택 필터 */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex space-x-2">
          <button
            className={`rounded-md px-4 py-2 text-sm ${timeRange === 'today' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTimeRange('today')}
          >
            오늘
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm ${timeRange === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTimeRange('week')}
          >
            이번 주
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm ${timeRange === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTimeRange('month')}
          >
            이번 달
          </button>
          {/* 날짜 직접 선택 UI 추가 가능 */}
        </div>
      </div>

      {/* 실시간 방문자 통계 카드 */}
      <LiveVisitorsCard
        currentVisitors={statsData.currentVisitors}
        totalToday={statsData.totalToday}
        peakToday={statsData.peakToday}
        isLoading={isLoading}
      />

      {/* 방문자 시간대별 차트 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VisitorsChart
          data={statsData.visitorsByTime}
          timeRange={timeRange}
          isLoading={isLoading}
        />

        {/* 디바이스 분석 */}
        <DeviceBreakdown data={statsData.deviceStats} isLoading={isLoading} />
      </div>

      {/* 인기 페이지 */}
      <PageViewsTable data={statsData.popularPages} isLoading={isLoading} />
    </>
  );
};

export default VisitorsPage;
