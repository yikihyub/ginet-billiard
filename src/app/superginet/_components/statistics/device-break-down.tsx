'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface DeviceBreakdownProps {
  data: Array<{
    device: string;
    count: number;
  }>;
  isLoading: boolean;
}

const DeviceBreakdown: React.FC<DeviceBreakdownProps> = ({
  data,
  isLoading,
}) => {
  // 차트 색상
  const COLORS = [
    '#4f46e5',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
  ];

  // 디바이스 타입 한글화
  const deviceNameMap: { [key: string]: string } = {
    mobile: '모바일',
    tablet: '태블릿',
    desktop: '데스크톱',
    'smart-tv': '스마트 TV',
    console: '게임기',
    unknown: '기타',
  };

  // 데이터 포맷팅 (한글 이름 추가)
  const formatData = () => {
    return data.map((item) => ({
      ...item,
      name: deviceNameMap[item.device] || item.device,
    }));
  };

  // 총 방문자 수 계산
  const totalVisitors = data.reduce((sum, item) => sum + item.count, 0);

  // 각 디바이스 비율 계산
  const calculatePercentage = (count: any) => {
    if (totalVisitors === 0) return '0%';
    return `${Math.round((count / totalVisitors) * 100)}%`;
  };

  // 로딩 중 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-4 h-6 w-36 animate-pulse rounded bg-gray-200"></div>
        <div className="h-64 w-full animate-pulse rounded bg-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-700">디바이스 분석</h3>
      <div className="h-64">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formatData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ name, count }) => `${name}: ${count}`}
              >
                {formatData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value}명 (${calculatePercentage(value)})`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 디바이스 목록 표시 */}
      <div className="mt-4 space-y-2">
        {formatData().map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{item.count}명</span>
              <span className="ml-1 text-gray-500">
                ({calculatePercentage(item.count)})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceBreakdown;
