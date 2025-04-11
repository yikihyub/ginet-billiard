'use client';

import React from 'react';
import { Clock, Users, Eye } from 'lucide-react';

interface PageViewsTableProps {
  data: Array<{
    url: string;
    visitors: number;
    pageviews: number;
    avgTime: number;
  }>;
  isLoading: boolean;
}

const PageViewsTable: React.FC<PageViewsTableProps> = ({ data, isLoading }) => {
  // URL에서 경로 부분만 추출하는 함수
  const formatUrl = (url: string) => {
    try {
      // URL 객체를 생성하여 pathname 추출
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch (error) {
      console.log(error);
      return url;
    }
  };

  // 페이지 제목 추출 (마지막 경로 세그먼트 사용)
  const getPageTitle = (url: string) => {
    try {
      // URL 객체를 생성하여 pathname 추출
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);

      // 마지막 세그먼트가 있으면 반환, 없으면 'Home'
      return pathSegments.length > 0
        ? decodeURIComponent(pathSegments[pathSegments.length - 1])
        : 'Home';
    } catch (error) {
      console.log(error);
      return url;
    }
  };

  // 시간(초)을 읽기 쉬운 형식으로 변환
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}초`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}분 ${remainingSeconds}초`;
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
      <h3 className="mb-4 text-lg font-medium text-gray-700">인기 페이지</h3>

      {data.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          아직 페이지 조회 데이터가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-2 font-medium">페이지</th>
                <th className="pb-2 font-medium">
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>방문자</span>
                  </div>
                </th>
                <th className="pb-2 font-medium">
                  <div className="flex items-center">
                    <Eye className="mr-1 h-4 w-4" />
                    <span>페이지뷰</span>
                  </div>
                </th>
                <th className="pb-2 font-medium">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>평균 체류시간</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((page, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3">
                    <div>
                      <div className="font-medium">
                        {getPageTitle(page.url)}
                      </div>
                      <div className="max-w-xs truncate text-xs text-gray-500">
                        {formatUrl(page.url)}
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{page.visitors.toLocaleString()}</td>
                  <td className="py-3">{page.pageviews.toLocaleString()}</td>
                  <td className="py-3">{formatTime(page.avgTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PageViewsTable;
