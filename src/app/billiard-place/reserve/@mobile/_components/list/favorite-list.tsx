'use client';

import React from 'react';
import { Star, MapPin, Phone, Clock, ChevronRight } from 'lucide-react';

// Define the Store interface
interface Store {
  id: number;
  name: string;
  address: string;
  distance: string;
  phone: string;
  rating: number;
  isOpen: boolean;
}

// Define the filter types
type FilterType = 'favorites' | 'recent' | 'searches';

// Define the mock data structure
interface StoreDataMap {
  favorites: Store[];
  recent: Store[];
  searches: Store[];
  [key: string]: Store[]; // Index signature for dynamic access
}

// Mock data for different list types
const mockStores: StoreDataMap = {
  favorites: [
    {
      id: 1,
      name: '당구클럽 홍대점',
      address: '서울 마포구 홍대입구역 3번 출구',
      distance: '0.3km',
      phone: '02-1234-5678',
      rating: 4.5,
      isOpen: true,
    },
    {
      id: 2,
      name: '당구존 강남역점',
      address: '서울 강남구 강남역 4번 출구',
      distance: '0.5km',
      phone: '02-9876-5432',
      rating: 4.2,
      isOpen: true,
    },
    {
      id: 3,
      name: '마스터 당구장',
      address: '서울 서대문구 신촌역 2번 출구',
      distance: '0.8km',
      phone: '02-2222-3333',
      rating: 4.7,
      isOpen: false,
    },
  ],
  recent: [
    {
      id: 4,
      name: '클래식 당구클럽',
      address: '서울 용산구 이태원역 1번 출구',
      distance: '1.2km',
      phone: '02-4444-5555',
      rating: 4.0,
      isOpen: true,
    },
    {
      id: 5,
      name: '프로 당구아카데미',
      address: '서울 종로구 광화문역 3번 출구',
      distance: '2.0km',
      phone: '02-6666-7777',
      rating: 4.8,
      isOpen: true,
    },
  ],
  searches: [
    {
      id: 6,
      name: '당구마스터즈',
      address: '서울 중구 을지로입구역 4번 출구',
      distance: '1.5km',
      phone: '02-8888-9999',
      rating: 3.9,
      isOpen: false,
    },
    {
      id: 7,
      name: '챔피언 당구클럽',
      address: '서울 성동구 왕십리역 2번 출구',
      distance: '1.8km',
      phone: '02-1212-3434',
      rating: 4.3,
      isOpen: true,
    },
    {
      id: 8,
      name: '스타일리쉬 당구존',
      address: '서울 동대문구 신설동역 1번 출구',
      distance: '2.5km',
      phone: '02-5656-7878',
      rating: 4.1,
      isOpen: true,
    },
  ],
};

interface FavoriteListProps {
  onCloseDrawer?: () => void;
  filterType?: FilterType | string;
}

export const FavoriteList = ({
  onCloseDrawer,
  filterType = 'favorites',
}: FavoriteListProps) => {
  // Select data based on filter type
  const stores = mockStores[filterType] || mockStores.favorites;

  // Empty state for when there's no data
  if (stores.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-400">
        <div className="mb-4 text-6xl">😢</div>
        {filterType === 'favorites' && <p>즐겨찾기한 당구장이 없습니다.</p>}
        {filterType === 'recent' && <p>최근 이용한 당구장이 없습니다.</p>}
        {filterType === 'searches' && <p>최근 검색한 기록이 없습니다.</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stores.map((store: Store) => (
        <div
          key={store.id}
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
          onClick={() => {
            // Handle store selection (e.g., show on map, navigate to detail)
            if (onCloseDrawer) onCloseDrawer();
          }}
        >
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-lg font-medium">{store.name}</h3>
            <button
              className="text-yellow-400 hover:text-yellow-500"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                // Toggle favorite logic would go here
              }}
            >
              <Star
                className="h-5 w-5"
                fill={filterType === 'favorites' ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="mb-1 flex items-center text-sm text-gray-500">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{store.address}</span>
            <span className="ml-2 text-blue-500">{store.distance}</span>
          </div>

          <div className="mb-2 flex items-center text-sm text-gray-500">
            <Phone className="mr-1 h-4 w-4" />
            <span>{store.phone}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock
                className="mr-1 h-4 w-4"
                color={store.isOpen ? 'green' : 'red'}
              />
              <span
                className={`text-sm ${store.isOpen ? 'text-green-500' : 'text-red-500'}`}
              >
                {store.isOpen ? '영업중' : '영업종료'}
              </span>
            </div>

            <div className="flex items-center">
              <div className="mr-2 flex items-center">
                <Star
                  className="mr-1 h-4 w-4 text-yellow-400"
                  fill="currentColor"
                />
                <span className="text-sm">{store.rating}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
