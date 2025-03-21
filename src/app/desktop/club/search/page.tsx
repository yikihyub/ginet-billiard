'use client';

import React, { useState, useEffect } from 'react';
import MainBanner from '../_components/banner/main-banner';
import { BilliardGroup } from './_components/group/billiard-group';
import FilterSection from './_components/filter-section/filter-section';

interface ClubData {
  id: string;
  title: string;
  location: string;
  description: string;
  currentMembers: number;
  maxMembers: number;
  tags: string[];
  created: string;
  type: string;
}

export default function BilliardGroupsPage() {
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    query: '',
  });

  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: {
    location?: string;
    type?: string;
    query?: string;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 데이터 가져오기
  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true);
      try {
        // 필터를 쿼리 파라미터로 변환
        const queryParams = new URLSearchParams();
        if (filters.location) queryParams.set('location', filters.location);
        if (filters.type) queryParams.set('type', filters.type);
        if (filters.query) queryParams.set('query', filters.query);

        const response = await fetch(
          `/api/club/getclub?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error('동호회 목록을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setClubs(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        );
        console.error('동호회 목록 로딩 중 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, [filters]);

  // 로딩 상태 표시
  if (isLoading && clubs.length === 0) {
    return (
      <div className="p-4">
        <MainBanner />
        <FilterSection onFilterChange={handleFilterChange} />
        <div className="mt-8 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">동호회 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 오류 상태 표시
  if (error) {
    return (
      <div className="p-4">
        <MainBanner />
        <FilterSection onFilterChange={handleFilterChange} />
        <div className="mt-8 rounded-lg bg-red-50 p-4 text-center text-red-500">
          <p>{error}</p>
          <button
            className="mt-2 rounded bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  // 검색 결과가 없는 경우
  if (clubs.length === 0) {
    return (
      <div className="p-4">
        <MainBanner />
        <FilterSection onFilterChange={handleFilterChange} />
        <div className="mt-8 rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
          <p className="mt-2 text-sm text-gray-400">
            다른 검색어로 다시 시도해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <MainBanner />
      <FilterSection onFilterChange={handleFilterChange} />
      <div className="min-h-[50vh]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {clubs.map((club) => (
            <BilliardGroup
              key={club.id}
              id={club.id}
              title={club.title}
              location={club.location}
              currentMembers={club.currentMembers}
              maxMembers={club.maxMembers}
              // tags={club.tags}
              // description={
              //   club.description?.substring(0, 100) +
              //   (club.description?.length > 100 ? '...' : '')
              // }
              type={club.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
