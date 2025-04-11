'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MemberReview } from '@/types/(match)';

interface GameDurationChartProps {
  reviews: MemberReview[];
}

export default function GameDurationChart({ reviews }: GameDurationChartProps) {
  // 게임 시간 데이터 가공
  const durationData = useMemo(() => {
    // 시간대별 게임 수 집계
    const durationCounts = {
      under20min: 0,
      '20to30min': 0,
      '30to1hours': 0,
      over1hours: 0,
    };

    reviews.forEach((review) => {
      if (review.play_time && durationCounts.hasOwnProperty(review.play_time)) {
        durationCounts[review.play_time as keyof typeof durationCounts]++;
      }
    });

    // 차트 데이터 포맷으로 변환
    return [
      { name: '20분 이내', value: durationCounts.under20min, color: '#38bdf8' },
      { name: '20~30분', value: durationCounts['20to30min'], color: '#818cf8' },
      {
        name: '30분~1시간',
        value: durationCounts['30to1hours'],
        color: '#c084fc',
      },
      {
        name: '1시간 이상',
        value: durationCounts.over1hours,
        color: '#f472b6',
      },
    ].filter((item) => item.value > 0); // 값이 0인 항목은 제외
  }, [reviews]);

  // 가장 많은 시간대 계산
  const mostFrequentDuration = useMemo(() => {
    if (durationData.length === 0) return null;

    return durationData.reduce(
      (max, item) => (item.value > max.value ? item : max),
      durationData[0]
    );
  }, [durationData]);

  // 게임 수가 없는 경우
  if (durationData.length === 0) {
    return (
      <div className="mb-2 bg-white p-4 shadow-sm">
        <h3 className="text-md mb-2 font-bold text-gray-800">게임 시간 분석</h3>
        <div className="py-6 text-center text-gray-500">
          게임 시간 데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 bg-white p-4 shadow-sm">
      <h3 className="text-md mb-4 font-bold text-gray-800">게임 시간 분석</h3>

      {mostFrequentDuration && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">주로</p>
          <p className="text-lg font-bold text-indigo-600">
            {mostFrequentDuration.name}
          </p>
          <p className="text-sm text-gray-600">안에 게임을 마무리합니다</p>
        </div>
      )}

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={durationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {durationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}회`, '게임 수']}
              contentStyle={{ borderRadius: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {durationData.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">
              {entry.name}: {entry.value}회
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
