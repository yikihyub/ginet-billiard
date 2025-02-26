'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// 장소 데이터의 타입 정의
interface Place {
  id: number;
  name: string;
  address: string;
  rating: number;
}

// 배지 타입 정의
type CategoryType = 'favorites' | 'recentVisits' | 'recentSearches' | null;

const FavoritesList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(null);

  // 배지 클릭 핸들러
  const handleCategoryClick = (category: CategoryType) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  // 즐겨찾기 데이터
  const favorites: Place[] = [
    {
      id: 1,
      name: '브레통대대클럽',
      address: '충청남도 당진시 합덕읍 288-2',
      rating: 4.5,
    },
    {
      id: 2,
      name: '박산 당구클럽',
      address: '충청남도 당진시 합덕읍 288-2',
      rating: 4.3,
    },
  ];

  // 최근 이용 데이터
  const recentVisits: Place[] = [
    {
      id: 3,
      name: '스타 당구클럽',
      address: '충청남도 당진시 유곡읍 229-2',
      rating: 4.2,
    },
  ];

  // 최근 검색 데이터
  const recentSearches: Place[] = [
    {
      id: 4,
      name: '노블 당구클럽',
      address: '충청남도 당진시 합덕읍 1522',
      rating: 4.6,
    },
    {
      id: 5,
      name: '우리당구클럽',
      address: '충청남도 당진시 합덕읍 1523',
      rating: 4.1,
    },
  ];

  // 활성 카테고리에 따라 데이터 선택
  const getActiveData = (): { title: string; data: Place[] } => {
    switch (activeCategory) {
      case 'favorites':
        return { title: '즐겨찾기한 당구장', data: favorites };
      case 'recentVisits':
        return { title: '최근 이용한 당구장', data: recentVisits };
      case 'recentSearches':
        return { title: '최근 검색한 당구장', data: recentSearches };
      default:
        return { title: '', data: [] };
    }
  };

  const activeData = getActiveData();

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
            className="flex bg-white px-3 py-2 text-sm font-medium"
            onClick={() => handleCategoryClick('recentVisits')}
          >
            <span>🕒</span>
            <span>최근이용</span>
          </Badge>

          <Badge
            variant={
              activeCategory === 'recentSearches' ? 'default' : 'outline'
            }
            className="flex bg-white px-3 py-2 text-sm font-medium"
            onClick={() => handleCategoryClick('recentSearches')}
          >
            <span>🔍</span>
            <span>최근검색</span>
          </Badge>
        </div>
      </div>

      {/* 선택된 카테고리의 내용 */}
      {activeCategory && (
        <>
          {/* 광고 */}
          <div className="relative mb-2 h-[72px] w-full">
            <Image
              src="/logo/billard_web_banner.png"
              alt="top-img"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="bg-white">
            <h3 className="mb-4 border-t pt-4 text-lg font-bold">
              {activeData.title}
            </h3>
            <div className="space-y-2">
              {activeData.data.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between rounded-md border bg-card p-4"
                >
                  <div>
                    <div className="font-medium">{place.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {place.address}
                    </div>
                  </div>
                  <button className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
                    예약
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesList;
