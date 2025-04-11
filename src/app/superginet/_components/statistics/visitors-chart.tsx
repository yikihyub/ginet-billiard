'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface VisitorsChartProps {
  data: Array<{
    time: string;
    count: number;
  }>;
  timeRange: 'today' | 'week' | 'month' | 'custom';
  isLoading: boolean;
}

const VisitorsChart: React.FC<VisitorsChartProps> = ({
  data,
  timeRange,
  isLoading,
}) => {
  // 차트 데이터 포맷팅
  const formatData = () => {
    return data.map((item) => {
      try {
        // 시간 문자열을 Date 객체로 변환
        const date = parseISO(item.time);

        // 시간 범위에 따라 다른 형식으로 표시
        let formattedTime;
        switch (timeRange) {
          case 'today':
            formattedTime = format(date, 'HH:00', { locale: ko });
            break;
          case 'week':
            formattedTime = format(date, 'EEE', { locale: ko });
            break;
          case 'month':
            formattedTime = format(date, 'MM/dd', { locale: ko });
            break;
          default:
            formattedTime = format(date, 'MM/dd HH:00', { locale: ko });
        }

        return {
          ...item,
          formattedTime,
        };
      } catch (error) {
        console.log(error);
        return {
          ...item,
          formattedTime: item.time,
        };
      }
    });
  };

  // 차트 제목 설정
  const getChartTitle = () => {
    switch (timeRange) {
      case 'today':
        return '오늘 시간대별 방문자';
      case 'week':
        return '이번 주 일별 방문자';
      case 'month':
        return '이번 달 일별 방문자';
      default:
        return '방문자 추이';
    }
  };

  // 로딩 중 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-64 w-full animate-pulse rounded bg-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-700">
        {getChartTitle()}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formatData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedTime" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`${value} 명`, '방문자']}
              labelFormatter={(label) => `시간: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitorsChart;
