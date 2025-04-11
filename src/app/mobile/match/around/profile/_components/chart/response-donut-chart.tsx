'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSearchParams } from 'next/navigation';

export default function ResponseDonutChart() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName');

  const [responseData, setResponseData] = useState([
    { name: '승락', value: 0 },
    { name: '거절', value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponseData = async () => {
      if (!userName) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/match/gameres?userName=${encodeURIComponent(userName)}`
        );

        if (!response.ok) {
          throw new Error('응답률 데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();

        setResponseData([
          { name: '승락', value: data.responseStats.accept },
          { name: '거절', value: data.responseStats.reject },
        ]);
      } catch (error) {
        console.error('응답률 데이터 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponseData();
  }, [userName]);

  const COLORS = ['#4ade80', '#f87171']; // 초록, 빨강

  // 데이터 계산
  const total = responseData.reduce((sum, item) => sum + item.value, 0);
  const accept = responseData.find((d) => d.name === '승낙')?.value || 0;
  const reject = total - accept;
  const rate = total > 0 ? ((accept / total) * 100).toFixed(1) : '0';

  // 로딩 상태
  if (loading) {
    return (
      <div className="mb-3 bg-white p-5 shadow-sm">
        <div className="text-md mb-4 font-bold text-gray-800">게임 응답률</div>
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    console.log(setError(error));
    return (
      <div className="mb-3 bg-white p-5 shadow-sm">
        <div className="text-md mb-4 font-bold text-gray-800">게임 응답률</div>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (total === 0) {
    return (
      <div className="mb-3 bg-white p-5 shadow-sm">
        <div className="text-md mb-4 font-bold text-gray-800">게임 응답률</div>
        <div className="py-10 text-center text-gray-500">
          아직 게임 응답 데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 bg-white p-5 shadow-sm">
      <div className="text-md mb-4 font-bold text-gray-800">게임 응답률</div>
      <div className="mx-auto flex w-full items-center justify-between">
        {/* 도넛 그래프 */}
        <div className="relative">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={responseData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {responseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                    stroke="#fff"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* 가운데 퍼센트 표시 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-gray-800">{rate}%</p>
            <p className="text-xs text-gray-500">응답률</p>
          </div>
        </div>

        {/* 오른쪽 정보 */}
        <div className="flex min-w-40 flex-col gap-3 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center font-medium">
            <span className="mr-2 h-3 w-3 rounded-full bg-green-400"></span>
            <span className="text-gray-600">승낙</span>
            <span className="ml-auto font-bold text-green-600">{accept}건</span>
          </div>
          <div className="flex items-center font-medium">
            <span className="mr-2 h-3 w-3 rounded-full bg-red-400"></span>
            <span className="text-gray-600">기권</span>
            <span className="ml-auto font-bold text-red-500">{reject}건</span>
          </div>
          <div className="my-1 h-px w-full bg-gray-200"></div>
          <p className="text-sm font-medium text-gray-600">
            총 <span className="font-bold text-gray-800">{total}건</span>의 경기
            요청
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
        * 게임 응답률은 상대방이 경기를 신청하고 응답한 비율입니다.
      </div>
    </div>
  );
}
