'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// 당구장 데이터 타입 정의
interface BiStore {
  id: number;
  name: string;
  address: string;
  hourly_rate?: number;
  brand?: string;
  open_time?: string;
  close_time?: string;
  phone?: string;
}

// 배지 타입 정의
type CategoryType = 'favorites' | 'recentVisits' | 'recentSearches' | null;

// 최근 검색 타입 정의
interface RecentSearch {
  id: number;
  search_term: string;
  place_id: number | null;
  store: BiStore | null;
  created_at: string;
}

const FavoritesList: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  const [activeCategory, setActiveCategory] = useState<CategoryType>(null);

  // 데이터 상태
  const [favorites, setFavorites] = useState<BiStore[]>([]);
  const [recentVisits, setRecentVisits] = useState<BiStore[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);

  // userId 또는 activeCategory가 변경될 때만 데이터 로드
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!userId || !activeCategory) return;

      try {
        setLoading(true);

        if (activeCategory === 'favorites') {
          const response = await fetch(
            `/api/favorite/getfavorite?userId=${userId}`
          );

          if (!response.ok) {
            throw new Error('즐겨찾기 로드 중 오류 발생');
          }

          const data = await response.json();
          if (userId) {
            setFavorites(data);
          }
        } else if (activeCategory === 'recentVisits') {
          const response = await fetch(
            `/api/recentvisit/getrecentvisit?userId=${userId}`
          );

          if (!response.ok) {
            throw new Error('최근 이용 로드 중 오류 발생');
          }

          const data = await response.json();
          setRecentVisits(data);
        } else if (activeCategory === 'recentSearches') {
          const response = await fetch(
            `/api/recentsearch/getrecentsearch?userId=${userId}`
          );

          if (!response.ok) {
            throw new Error('최근 검색 로드 중 오류 발생');
          }

          const data = await response.json();
          setRecentSearches(data);
        }
      } catch (error) {
        console.error(`${activeCategory} 데이터 로드 중 오류 발생:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [userId, activeCategory]);

  // 배지 클릭 핸들러 - 상태만 변경하고 데이터 로드는 useEffect에서 처리
  const handleCategoryClick = (category: CategoryType) => {
    // 같은 카테고리를 다시 클릭하면 닫기
    if (activeCategory === category) {
      setActiveCategory(null);
      return;
    }

    setActiveCategory(category);
  };

  // 즐겨찾기 제거 핸들러
  const handleRemoveFavorite = async (placeId: number) => {
    try {
      const response = await fetch(
        `/api/favorite/deletefavorite?userId=${userId}&placeId=${placeId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('즐겨찾기 제거 중 오류 발생');
      }

      // 즐겨찾기 목록에서 제거
      setFavorites((prev) => prev.filter((place) => place.id !== placeId));
    } catch (error) {
      console.error('즐겨찾기 제거 중 오류 발생:', error);
    }
  };

  // 최근 검색 제거 핸들러
  const handleRemoveRecentSearch = async (searchId: number) => {
    try {
      const response = await fetch(
        `/api/recentsearch/deleterecentsearch?userId=${userId}&id=${searchId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('최근 검색 제거 중 오류 발생');
      }

      // 최근 검색 목록에서 제거
      setRecentSearches((prev) =>
        prev.filter((search) => search.id !== searchId)
      );
    } catch (error) {
      console.error('최근 검색 제거 중 오류 발생:', error);
    }
  };

  // 즐겨찾기 항목 렌더링
  const renderFavoriteItem = (place: BiStore) => (
    <div
      key={place.id}
      className="flex items-center justify-between rounded-md border p-4"
    >
      <div>
        <div className="font-medium">{place.name}</div>
        <div className="text-xs text-muted-foreground">{place.address}</div>
        {place.hourly_rate && (
          <div className="text-xs text-muted-foreground">
            시간당 {place.hourly_rate}원
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          className="rounded-md bg-red-500 px-2 py-1 text-xs text-white"
          onClick={() => handleRemoveFavorite(place.id)}
        >
          삭제
        </button>
        <button
          className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
          onClick={() =>
            (window.location.href = `/billiard-place/detail/${place.id}`)
          }
        >
          예약
        </button>
      </div>
    </div>
  );

  // 최근 이용 항목 렌더링
  const renderRecentVisitItem = (place: BiStore) => (
    <div
      key={place.id}
      className="flex items-center justify-between rounded-md border p-4"
    >
      <div>
        <div className="font-medium">{place.name}</div>
        <div className="text-xs text-muted-foreground">{place.address}</div>
        {place.hourly_rate && (
          <div className="text-xs text-muted-foreground">
            시간당 {place.hourly_rate}원
          </div>
        )}
      </div>
      <button
        className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
        onClick={() =>
          (window.location.href = `/billiard-place/detail/${place.id}`)
        }
      >
        예약
      </button>
    </div>
  );

  // 최근 검색 항목 렌더링
  const renderRecentSearchItem = (recentSearches: RecentSearch) => (
    <div
      key={recentSearches.id}
      className="flex items-center justify-between rounded-md border p-4"
    >
      <div>
        {/* 이름만 표시 */}
        <div className="font-medium">
          {recentSearches.store
            ? recentSearches.store.name
            : recentSearches.search_term}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          className="rounded-md bg-red-500 px-2 py-1 text-xs text-white"
          onClick={() => handleRemoveRecentSearch(recentSearches.id)}
        >
          삭제
        </button>
        {recentSearches.store && (
          <button
            className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
            onClick={() =>
              (window.location.href = `/billiard-place/detail/${recentSearches.store?.id}`)
            }
          >
            예약
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`h-full p-3 ${activeCategory ? 'bg-white' : ''}`}>
      <div className="flex flex-col justify-between pb-3">
        {/* 카테고리 배지 */}
        <div className="flex gap-4">
          <Badge
            variant={activeCategory === 'favorites' ? 'default' : 'outline'}
            className={`flex bg-white px-3 py-2 text-sm font-medium ${
              activeCategory === 'favorites'
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-400 bg-white text-gray-700'
            } `}
            onClick={() => handleCategoryClick('favorites')}
          >
            <span>⭐</span>
            <span>즐겨찾기</span>
          </Badge>

          <Badge
            variant={activeCategory === 'recentVisits' ? 'default' : 'outline'}
            className={`flex bg-white px-3 py-2 text-sm font-medium ${
              activeCategory === 'recentVisits'
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-400 bg-white text-gray-700'
            }`}
            onClick={() => handleCategoryClick('recentVisits')}
          >
            <span>🕒</span>
            <span>최근이용</span>
          </Badge>

          <Badge
            variant={
              activeCategory === 'recentSearches' ? 'default' : 'outline'
            }
            className={`flex bg-white px-3 py-2 text-sm font-medium ${
              activeCategory === 'recentSearches'
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-400 bg-white text-gray-700'
            }`}
            onClick={() => handleCategoryClick('recentSearches')}
          >
            <span>🔍</span>
            <span>최근관심</span>
          </Badge>
        </div>
      </div>

      {/* 선택된 카테고리의 내용 */}
      {activeCategory && (
        <>
          {/* 광고 */}
          <div className="relative mb-2 h-[72px] w-full bg-[#1D3D1C]">
            <Image
              src="/logo/logo_banner_g.png"
              alt="top-img"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="bg-white">
            <h3 className="mb-4 border-t pt-4 text-lg font-bold">
              {activeCategory === 'favorites' && '즐겨찾기한 당구장'}
              {activeCategory === 'recentVisits' && '최근 이용한 당구장'}
              {activeCategory === 'recentSearches' && '최근 검색한 당구장'}
            </h3>

            {/* 로딩 표시 */}
            {loading ? (
              <div className="flex justify-center py-4">
                <span>로딩 중...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {/* 데이터가 없을 때 메시지 표시 */}
                {activeCategory === 'favorites' && favorites.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    즐겨찾기가 없습니다.
                  </div>
                )}

                {activeCategory === 'recentVisits' &&
                  recentVisits.length === 0 && (
                    <div className="py-4 text-center text-gray-500">
                      최근 이용한 당구장이 없습니다.
                    </div>
                  )}

                {activeCategory === 'recentSearches' &&
                  recentSearches.length === 0 && (
                    <div className="py-4 text-center text-gray-500">
                      최근 검색 기록이 없습니다.
                    </div>
                  )}

                {/* 각 카테고리별 데이터 렌더링 */}
                {activeCategory === 'favorites' &&
                  favorites.map((place) => renderFavoriteItem(place))}

                {activeCategory === 'recentVisits' &&
                  recentVisits.map((place) => renderRecentVisitItem(place))}

                {activeCategory === 'recentSearches' &&
                  recentSearches.map((search) =>
                    renderRecentSearchItem(search)
                  )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesList;
