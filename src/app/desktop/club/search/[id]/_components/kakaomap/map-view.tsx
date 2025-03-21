'use client';

import React, { useEffect, useRef } from 'react';
import { loadKakaoMapsScript } from '@/lib/kakaomap';

interface MapViewProps {
  address: string;
  placeName?: string;
  height?: string;
}

export default function MapView({ address, placeName, height }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!address || !mapRef.current) return;

    const initializeMap = async () => {
      try {
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
          level: 4,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        const marker = new window.kakao.maps.Marker();

        // 주소로 좌표 검색
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );

            marker.setPosition(coords);
            marker.setMap(map);
            map.setCenter(coords);

            // 인포윈도우 생성 (장소명이 있는 경우)
            if (placeName) {
              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;">${placeName}</div>`,
              });
              infowindow.open(map, marker);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // 컴포넌트가 마운트된 후에 초기화 실행
    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, [address, placeName]);

  return (
    <div
      ref={mapRef}
      className="w-full overflow-hidden rounded-lg"
      style={{
        height,
        background: '#f8f9fa',
      }}
    />
  );
}
