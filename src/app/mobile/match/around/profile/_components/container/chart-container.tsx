'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RecentTenChart from '../chart/recent-ten-chart';
import HighrunChart from '../chart/highrun-chart';
import ResponseDonutChart from '../chart/response-donut-chart';
import { gameTypeMap } from '@/constants/(member)/profile';
import { MemberReview } from '@/types/(match)';
import GameDurationChart from '../chart/game-duration-chart';

export default function ChartContainer() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName');
  const [reviews, setReviews] = useState<MemberReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    if (!userName) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/member/reviews?userName=${encodeURIComponent(userName)}`
        );

        if (!response.ok) {
          throw new Error(`API 응답 오류: ${response.status}`);
        }

        const data = await response.json();

        // API가 null을 반환하는 경우 처리
        if (!data || data.error) {
          throw new Error(data?.error || '데이터를 불러오는데 실패했습니다.');
        }

        // 리뷰 데이터 설정
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('리뷰 데이터 조회 오류:', error);
        setError(
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.'
        );
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userName]);

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p>통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="mb-2 text-red-600">오류가 발생했습니다</p>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  console.log(reviews);

  // 리뷰가 없는 경우에도 일단 차트 컨테이너 표시 (ResponseDonutChart는 별도 API로 데이터를 가져옴)
  return (
    <div className="bg-gray-100 pb-24">
      {/* 게임 응답률 통계 - 별도 API로 데이터 가져옴 */}
      <ResponseDonutChart />

      {reviews.length === 0 ? (
        <div className="mb-3 rounded-lg bg-white p-6 text-center shadow-sm">
          <p className="mb-2 text-lg">아직 경기 통계 데이터가 없습니다</p>
          <p className="text-sm text-gray-600">
            {userName}님의 첫 번째 경기 후 통계가 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          {/* 게임 유형별 하이런 */}
          <HighrunChart reviews={reviews} gameTypeMap={gameTypeMap} />

          {/* 게임 평균 시간 */}
          <GameDurationChart reviews={reviews} />

          {/* 최근 10경기 */}
          <RecentTenChart reviews={reviews} />
        </>
      )}
    </div>
  );
}
