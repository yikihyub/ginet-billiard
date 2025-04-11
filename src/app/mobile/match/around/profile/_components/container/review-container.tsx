'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/constants/(member)/profile';
import { MemberReview } from '@/types/(match)';

export default function ReviewContainer() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName');
  const [reviews, setReviews] = useState<MemberReview[]>([]);
  const [userData, setUserData] = useState<{
    mb_id: string;
    name: string;
  } | null>(null);
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

        // 사용자 정보 설정
        if (data.user) {
          setUserData(data.user);
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

  // 카테고리별로 데이터 카운트
  // const getCategoryOptionCounts = (categoryKey: keyof typeof categories) => {
  //   const countMap: Record<string, number> = {};

  //   // 초기화
  //   categories[categoryKey].options.forEach((option) => {
  //     countMap[option] = 0;
  //   });

  //   // 카운트
  //   reviews.forEach((review) => {
  //     let value = '';

  //     switch (categoryKey) {
  //       case 'manner':
  //         value = review.mannerCategory || '';
  //         break;
  //       case 'rules':
  //         value = review.rulesCategory || '';
  //         break;
  //       case 'time':
  //         value = review.timeCategory || '';
  //         break;
  //       case 'skill':
  //         value = review.skillLevelCategory || '';
  //         break;
  //     }

  //     if (value && countMap[value] !== undefined) {
  //       countMap[value]++;
  //     }
  //   });

  //   // 카운트 기준으로 정렬
  //   return Object.entries(countMap).sort((a, b) => b[1] - a[1]);
  // };

  // 모든 카테고리의 옵션 합쳐서 상위 항목 추출
  // const getTopRatedOptions = () => {
  //   const allOptions: [string, number][] = [];

  //   (Object.keys(categories) as Array<keyof typeof categories>).forEach(
  //     (categoryKey) => {
  //       const counts = getCategoryOptionCounts(categoryKey);
  //       allOptions.push(...counts);
  //     }
  //   );

  //   return allOptions.sort((a, b) => b[1] - a[1]);
  // };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p>평가 데이터를 불러오는 중...</p>
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

  // 리뷰가 없는 경우 표시
  if (reviews.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <p className="mb-2 text-lg">아직 평가가 없습니다</p>
        <p className="text-sm text-gray-600">
          {userData?.name || userName}님에 대한 첫 번째 평가를 남겨보세요.
        </p>
        <button className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white">
          리뷰 작성하기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 pb-24">
      {/* "이런 점이 좋았어요" 섹션 */}
      <div className="mb-4 bg-white">
        {/* 리뷰 참여 수 */}
        <div className="flex items-center px-4 py-3">
          <span className="text-green-500">✓</span>
          <span className="ml-1">{reviews.length}회</span>
          <span className="ml-1 text-gray-500">{reviews.length}명 참여</span>
        </div>

        {/* 카테고리별 통계 */}
        <div>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* 매너 카테고리 */}
            <div className="bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-gray-700">
                {categories.manner.title}
              </h3>
              <div className="space-y-2">
                {categories.manner.options.map((option) => {
                  const count = reviews.filter(
                    (r) => r.mannerCategory === option
                  ).length;
                  return (
                    <div
                      key={option}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        reviews.filter((r) => r.mannerCategory === option)
                          .length > 0
                          ? 'bg-green-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span>{option}</span>
                      </div>
                      <span className="font-medium text-blue-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 규칙 준수 카테고리 */}
            <div className="bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-gray-700">
                {categories.rules.title}
              </h3>
              <div className="space-y-2">
                {categories.rules.options.map((option) => {
                  const count = reviews.filter(
                    (r) => r.rulesCategory === option
                  ).length;
                  return (
                    <div
                      key={option}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        reviews.filter((r) => r.rulesCategory === option)
                          .length > 0
                          ? 'bg-green-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span>{option}</span>
                      </div>
                      <span className="font-medium text-blue-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 시간 준수 카테고리 */}
            <div className="bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-gray-700">
                {categories.time.title}
              </h3>
              <div className="space-y-2">
                {categories.time.options.map((option) => {
                  const count = reviews.filter(
                    (r) => r.timeCategory === option
                  ).length;
                  return (
                    <div
                      key={option}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        reviews.filter((r) => r.timeCategory === option)
                          .length > 0
                          ? 'bg-green-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span>{option}</span>
                      </div>
                      <span className="font-medium text-blue-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 기술 수준 카테고리 */}
            <div className="bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-gray-700">
                {categories.skill.title}
              </h3>
              <div className="space-y-2">
                {categories.skill.options.map((option) => {
                  const count = reviews.filter(
                    (r) => r.skillLevelCategory === option
                  ).length;
                  return (
                    <div
                      key={option}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        reviews.filter((r) => r.skillLevelCategory === option)
                          .length > 0
                          ? 'bg-green-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span>{option}</span>
                      </div>
                      <span className="font-medium text-blue-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
