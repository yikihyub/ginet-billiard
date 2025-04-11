'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useSearch } from '../provider/search-provider';
import { ChevronLeft, Search, MapPin, Loader2 } from 'lucide-react';

export function SearchInput() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    filteredRooms,
    isLoading,
    error,
    setLocation,
  } = useSearch();

  const [isSearchViewActive, setIsSearchViewActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색어 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 검색창 포커스 핸들러
  const handleInputFocus = () => {
    setIsSearchViewActive(true);
  };

  // 검색 화면 닫기
  const closeSearchView = () => {
    setIsSearchViewActive(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleStoreSelect = (store: any) => {
    let lat, lng;

    // 다양한 데이터 구조에 대응
    if (store.latitude !== undefined && store.longitude !== undefined) {
      // 직접 lat, lng 값이 있는 경우
      lat = store.latitude;
      lng = store.longitude;
    } else if (store.lat !== undefined && store.lng !== undefined) {
      // lat, lng으로 있는 경우
      lat = store.lat;
      lng = store.lng;
    } else if (store.location) {
      // location 객체 안에 있는 경우
      if (
        store.location.latitude !== undefined &&
        store.location.longitude !== undefined
      ) {
        lat = store.location.latitude;
        lng = store.location.longitude;
      } else if (
        store.location.lat !== undefined &&
        store.location.lng !== undefined
      ) {
        lat = store.location.lat;
        lng = store.location.lng;
      } else if (typeof store.location === 'string') {
        // 문자열로 저장된 경우 (예: "lat,lng" 형식)
        try {
          const [latStr, lngStr] = store.location.split(',');
          lat = parseFloat(latStr);
          lng = parseFloat(lngStr);
        } catch (e) {
          console.error('Failed to parse location string:', e);
        }
      }
    }

    // 위치 이동
    if (lat !== undefined && lng !== undefined) {
      // 기존 setLocation 함수 사용 (level 매개변수는 기본값 사용)
      setLocation(lat, lng, 1);
    } else {
      console.error('위치 정보를 찾을 수 없습니다:', store);
    }

    // 검색 화면 닫기
    closeSearchView();
  };

  // 홈으로 이동
  const goToHome = () => {
    router.push('/mobile');
  };

  return (
    <>
      {/* 기본 검색 UI */}
      <div className="fixed top-0 z-50 w-full px-2 pt-2">
        <div className="flex h-14 w-full items-center gap-2">
          {/* 검색 입력 필드 */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>

            <Input
              ref={inputRef}
              placeholder="당구장을 검색해보세요"
              className="text-md h-12 w-full rounded-md border-none bg-white pl-9 pr-10 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:border-transparent focus:ring-0"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              readOnly
            />
          </div>
          {/* 홈 버튼 */}

          <div
            className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-md bg-white hover:bg-gray-100"
            onClick={goToHome}
          >
            <div>
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-xs text-gray-400">뒤로</div>
          </div>
        </div>
      </div>

      {/* 검색 결과 오버레이 */}
      {isSearchViewActive && (
        <div className="fixed inset-0 z-[51] touch-auto overflow-hidden bg-white p-4">
          {/* 상단 바 */}
          <div className="relative flex h-12 items-center">
            <button
              className="mr-2 flex h-12 w-8 cursor-pointer flex-col items-center justify-center rounded-md bg-none hover:bg-gray-100"
              onClick={closeSearchView}
            >
              <ChevronLeft />
            </button>
            <div className="absolute left-11 top-1/2 -translate-y-1/2 bg-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              ref={inputRef}
              placeholder="당구장을 검색해보세요"
              className="text-md h-12 w-full rounded-md border-none bg-gray-100 pl-9 pr-10 transition-colors duration-200 hover:bg-gray-50 focus:border-transparent focus:ring-0"
              value={searchQuery}
              onChange={handleInputChange}
              autoFocus
            />
          </div>

          {/* 검색 결과 표시 영역 */}
          <div
            className="mt-4 touch-auto"
            style={{
              overscrollBehavior: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {isLoading ? (
              // 로딩 중일 때
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              // 에러 발생 시
              <div className="mt-8 text-center text-red-500">
                <p>검색 중 오류가 발생했습니다.</p>
                <p className="text-sm">{error.message}</p>
              </div>
            ) : filteredRooms && filteredRooms.length > 0 ? (
              // 검색 결과가 있을 때
              <div className="space-y-2" style={{ touchAction: 'pan-y' }}>
                <p className="mb-2 text-sm text-gray-500">
                  검색 결과: {filteredRooms.length}개
                </p>
                <div className="max-h-[90vh] overflow-y-auto">
                  {filteredRooms.map((store) => (
                    <div
                      key={store.id}
                      className="flex cursor-pointer items-start rounded-lg py-3 hover:bg-gray-50"
                      onClick={() => handleStoreSelect(store)}
                    >
                      <div className="mr-3 mt-1 rounded-full bg-green-100 p-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-gray-500">{store.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // 검색 결과가 없을 때
              <div className="flex h-[calc(100vh-180px)] flex-col items-center justify-center px-4">
                {searchQuery.trim() ? (
                  <p className="text-center text-gray-500">
                    검색 결과가 없습니다.
                  </p>
                ) : (
                  <p className="text-center text-gray-500">
                    최근 검색 기록이 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
