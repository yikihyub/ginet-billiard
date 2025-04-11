'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  Area,
} from 'recharts';
import { MemberReview } from '@/types/(match)';

// 일별 데이터 인터페이스
interface DayData {
  day: string;
  value: number;
  count: number;
}

// 컴포넌트 Props 인터페이스
interface HighrunChartProps {
  reviews: MemberReview[];
  gameTypeMap: Record<string, string>;
}

// GameType에 따른 탭 정의
const tabs = ['3구', '4구'] as const;
type TabType = (typeof tabs)[number];

export default function HighrunChart({ reviews }: HighrunChartProps) {
  const [selectedTab, setSelectedTab] = useState<TabType>('4구'); // 기본값을 4구로 변경
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [maxHighrun, setMaxHighrun] = useState<number>(0);

  // 요일 순서 정의 (월요일부터 시작)
  const dayOrder: string[] = ['월', '화', '수', '목', '금', '토', '일'];

  // 요일별 하이런 데이터 처리
  useEffect(() => {
    if (!reviews || reviews.length === 0) {
      setChartData([]);
      setMaxHighrun(0);
      return;
    }

    // 게임 유형별 데이터 분류
    const processData = (): DayData[] => {
      // 게임 타입 매핑 정의 - DB의 실제 값에 맞게 수정
      const gameTypeMapping: Record<string, string> = {
        three_cushion: '3구',
        'three-cushion': '3구',
        '3ball': '3구',
        four_ball: '4구',
        'four-ball': '4구',
        '4ball': '4구',
        pocket_billiards: '포켓볼',
        'pocket-billiards': '포켓볼',
      };

      // 게임 타입별 필터링
      const filteredReviews = reviews.filter((review) => {
        if (!review.game_type) return false;
        const gameType = review.game_type as string;
        const mappedType = gameTypeMapping[gameType] || '기타';
        return mappedType === selectedTab && review.highRun;
      });

      // 요일별 하이런 데이터 집계
      const dayData: Record<string, DayData> = {};
      dayOrder.forEach((day) => {
        dayData[day] = { day, value: 0, count: 0 };
      });

      filteredReviews.forEach((review) => {
        if (!review.date || !review.highRun) return;

        try {
          // 날짜 파싱하여 요일 얻기
          const dateParts = review.date.split('.');
          if (dateParts.length < 3) throw new Error('Invalid date format');

          // YYYY.MM.DD 형식 가정
          const date = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1, // 월은 0부터 시작
            parseInt(dateParts[2])
          );

          if (isNaN(date.getTime())) throw new Error('Invalid date');

          const day = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

          // 각 요일별 최고 하이런 업데이트
          if (review.highRun > dayData[day].value) {
            dayData[day].value = review.highRun;
          }

          dayData[day].count++;
        } catch (error) {
          console.log(error);
          // 날짜 변환 실패 시, 오늘 날짜의 요일에 추가 (임시 방편)
          const today = new Date();
          const day = ['일', '월', '화', '수', '목', '금', '토'][
            today.getDay()
          ];

          if (review.highRun > dayData[day].value) {
            dayData[day].value = review.highRun;
          }

          dayData[day].count++;
        }
      });

      // 요일 순서대로 데이터 정렬
      const sortedData = dayOrder.map((day) => dayData[day]);

      // 이번주 최고 하이런 계산
      const maxValue = Math.max(...sortedData.map((item) => item.value), 0);
      setMaxHighrun(maxValue);

      return sortedData;
    };

    setChartData(processData());
  }, [reviews, selectedTab]);

  // 첫 로드시 4구 탭 선택 (데이터가 있는 경우)
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const has4BallData = reviews.some(
        (review) => review.game_type === '4ball' && review.highRun
      );

      if (has4BallData) {
        setSelectedTab('4구');
      }
    }
  }, [reviews]);

  // 선택된 탭에 따른 색상 설정
  const lineColor = selectedTab === '3구' ? '#0d9488' : '#7c3aed';
  const areaColor = selectedTab === '3구' ? '#99f6e4' : '#c4b5fd';

  // 데이터가 없는 경우
  const hasData = chartData.some((item) => item.value > 0);

  return (
    <div className="mb-2 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-md font-bold text-gray-800">게임 내 하이런</div>
        <div className="flex items-center rounded-full bg-green-50 px-3 py-1">
          <span className="text-sm font-medium text-green-600">
            이번주 최고:{' '}
          </span>
          <span className="ml-1 text-lg font-bold text-green-700">
            {maxHighrun || '-'}
          </span>
        </div>
      </div>

      {/* 탭 버튼 */}
      <div className="mb-5 flex justify-center">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                selectedTab === tab
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 라인 차트 */}
      {hasData ? (
        <ResponsiveContainer width="100%" height={240} className="bg-none">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 10, left: 20 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              domain={[0, maxHighrun + Math.ceil(maxHighrun * 0.2)]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              width={25}
            />
            <Tooltip
              formatter={(value: number) => [value, '하이런']}
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                border: 'none',
              }}
              labelFormatter={(day: string) => `${day}요일 하이런`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fillOpacity={1}
              fill="url(#colorGradient)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={3}
              dot={{
                r: 5,
                fill: '#fff',
                stroke: lineColor,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: lineColor,
                stroke: '#fff',
                strokeWidth: 2,
              }}
              label={{
                position: 'top',
                fill: lineColor,
                fontSize: 13,
                fontWeight: 'bold',
                formatter: (value: number) => (value > 0 ? value : ''),
              }}
            />
            {/* 가로 구분선 (X축 기준선) */}
            <ReferenceLine y={0} stroke="#e0e0e0" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-60 items-center justify-center">
          <p className="text-gray-500">
            해당 게임 유형의 하이런 데이터가 없습니다
          </p>
        </div>
      )}

      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
        * 요일별 최고 하이런 기록을 보여줍니다.
      </div>
    </div>
  );
}
