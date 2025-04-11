'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from '../context/location-context';
import debounce from 'lodash/debounce';
import { Store } from '../../../_types';
import { MapBounds } from '@/types/(kakaomap)/kakao';
import {
  loadKakaoMapsScript,
  getMapBounds,
  createMarkerImage,
  fetchStores,
  getCurrentLocation,
} from '@/lib/kakaomap';

import { SearchInput } from '../search/search-input';

export default function KakaoMap() {
  const { location, setBounds } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<typeof window.kakao.maps.Map | null>(null);
  const currentMarker = useRef<typeof window.kakao.maps.Marker | null>(null);
  const storeMarkers = useRef<(typeof window.kakao.maps.Marker)[]>([]);
  const currentInfoWindow = useRef<typeof window.kakao.maps.InfoWindow | null>(
    null
  );

  if (isLoading) {
    <div>loading...</div>;
  }

  const displayStoreMarkers = useCallback(async (stores: Store[]) => {
    if (!mapInstance.current) return;

    storeMarkers.current.forEach((marker) => marker.setMap(null));
    storeMarkers.current = [];

    const markerImage = createMarkerImage();

    stores.forEach((store) => {
      const position = new window.kakao.maps.LatLng(
        store.latitude,
        store.longitude
      );
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstance.current,
        image: markerImage,
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div class="relative p-4 w-64">
            <h3 class="text-base font-bold">${store.name}</h3>
            <p class="text-sm text-gray-600">${store.address}</p>
            <a href ="/mobile/billiard-place/detail/${store.id}" class="text-sm text-gray-600">자세히 보기</p>
          </div>
        `,
        removable: true,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        currentInfoWindow.current?.close();
        infoWindow.open(mapInstance.current!, marker);
        currentInfoWindow.current = infoWindow;
      });

      storeMarkers.current.push(marker);
    });
  }, []);

  const debouncedFetchStores = useCallback(
    debounce(
      (bounds: MapBounds) => fetchStores(bounds, displayStoreMarkers),
      500
    ),
    [displayStoreMarkers]
  );

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        await loadKakaoMapsScript();

        if (!mapRef.current) throw new Error('Map ref not found');

        const options = {
          center: new window.kakao.maps.LatLng(location.lat, location.lng),
          level: 2,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        mapInstance.current = map;

        const handleMapChange = () => {
          if (!map) return;

          // const center = mapInstance.current.getCenter();

          const bounds = getMapBounds(map);
          setBounds(bounds);
          debouncedFetchStores(bounds);
        };

        window.kakao.maps.event.addListener(map, 'dragend', handleMapChange);
        window.kakao.maps.event.addListener(
          map,
          'zoom_changed',
          handleMapChange
        );

        const bounds = getMapBounds(map);
        await fetchStores(bounds, displayStoreMarkers);
      } catch (error) {
        console.error('Map initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setCenter(
      new window.kakao.maps.LatLng(location.lat, location.lng)
    );

    // ✅ 확대 레벨도 location.level에 맞게 설정
    mapInstance.current.setLevel(location.level);

    const bounds = getMapBounds(mapInstance.current);
    debouncedFetchStores(bounds);
  }, [location, debouncedFetchStores]);

  return (
    <div className="relative h-[100vh] overflow-hidden">
      <SearchInput />
      <div ref={mapRef} className="h-full w-full overflow-hidden" />
      <button
        onClick={() =>
          getCurrentLocation(mapInstance.current!, currentMarker.current)
        }
        className="fixed bottom-[92px] right-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-white shadow-sm"
        aria-label="현재 나의 위치"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#909090"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2" fill="#909090" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
        </svg>
      </button>
    </div>
  );
}
