'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { loadKakaoMapsScript } from '@/lib/kakaomap';

interface Store {
  id: number;
  name: string;
  owner_name: string | null;
  address: string;
}

interface BilliardSelectProps {
  onSelect: (store: Store | null) => void;
  value?: Store | null;
}

export default function BilliardSelect({
  onSelect,
  value,
}: BilliardSelectProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [marker, setMarker] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(
    value || null
  );

  if (isMapLoading) {
    <div>loading..</div>;
  }
  // 카카오맵 초기화
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        setIsMapLoading(true);
        await loadKakaoMapsScript();

        if (!window.kakao?.maps) {
          console.error('Kakao maps not loaded properly');
          return;
        }

        // 추가 로딩 대기
        await new Promise((resolve) => {
          if (window.kakao.maps.services) {
            resolve(true);
          } else {
            window.kakao.maps.load(() => {
              resolve(true);
            });
          }
        });

        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };

        const newMap = new window.kakao.maps.Map(mapRef.current, options);
        setMap(newMap);

        const newMarker = new window.kakao.maps.Marker();
        setMarker(newMarker);
      } catch (error) {
        console.error('Error initializing map:', error);
      } finally {
        setIsMapLoading(false);
      }
    };

    // 컴포넌트가 마운트된 후에 초기화 실행
    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, []);

  // 주소로 좌표 검색
  const searchLocation = (address: string) => {
    if (!map || !marker || !window.kakao?.maps) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

        marker.setPosition(coords);
        marker.setMap(map);
        map.setCenter(coords);
        map.setLevel(3);
      }
    });
  };

  // 매장 검색 API 호출
  const fetchStores = async (search: string) => {
    if (!search?.trim()) {
      setStores([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/store/allstore/${encodeURIComponent(search)}`
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      console.log('API Response:', data);

      if (Array.isArray(data)) {
        setStores(data);
      } else {
        setStores([]);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 디바운스 함수
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ) {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedFetch = React.useCallback(
    debounce((search: string) => fetchStores(search), 300),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedFetch(searchTerm);
    } else {
      setStores([]);
    }
  }, [searchTerm, debouncedFetch]);

  // 매장 선택 처리
  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    onSelect(store);
    searchLocation(store.address);
  };

  // 선택 취소
  const handleClearSelection = () => {
    setSelectedStore(null);
    onSelect(null);
    setSearchTerm('');
    if (marker) {
      marker.setMap(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {selectedStore ? (
        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{selectedStore.name}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {selectedStore.address}
              </p>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              변경
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          <Input
            placeholder="당구장 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2 h-14 bg-gray-100 text-lg"
          />

          <div className="max-h-[400px] overflow-auto">
            {isLoading ? (
              <div className="p-2 text-center text-gray-500">검색 중...</div>
            ) : stores.length === 0 ? (
              <div className="p-2 text-center text-gray-500">
                {searchTerm
                  ? '검색 결과가 없습니다.'
                  : '당구장을 입력해주세요.'}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => handleStoreSelect(store)} // handleStoreSelect로 변경
                    className="cursor-pointer rounded p-2 text-sm hover:bg-gray-100"
                  >
                    <div className="font-medium">{store.name}</div>
                    <div className="text-gray-600">{store.address}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="md:col-span-2">
        <div
          ref={mapRef}
          className="h-96 w-full rounded-lg border"
          style={{ background: '#f8f9fa' }}
        />
      </div>
    </div>
  );
}
