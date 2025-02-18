'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { loadKakaoMapsScript } from '@/lib/loadKakaoMap';
import { useLocation } from '../context/location-context';
import { Store } from '@/types/(reserve)';

interface KakaoGeocoderResponse {
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
  };
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
  } | null;
  x: string; // 경도
  y: string; // 위도
}

export default function KakaoMap() {
  const { location } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMapInstance] = useState<typeof window.kakao.maps.Map | null>(
    null
  );
  const [marker, setMarker] = useState<typeof window.kakao.maps.Marker | null>(
    null
  );
  const [storeMarkers, setStoreMarkers] = useState<
    (typeof window.kakao.maps.Marker)[]
  >([]);
  const currentInfoWindow = useRef<typeof window.kakao.maps.InfoWindow | null>(
    null
  );

  // 카카오맵 서비스가 완전히 로드된 후 실행
  const initializeGeocoder = async () => {
    return new Promise<void>((resolve) => {
      window.kakao.maps.load(() => {
        resolve();
      });
    });
  };

  //맵 뷰포인트 확인 함수
  const getMapBounds = (map: typeof window.kakao.maps.Map) => {
    const bounds = map.getBounds();
    const swLatLng = bounds.getSouthWest();
    const neLatLng = bounds.getNorthEast();

    return {
      swLat: swLatLng.getLat(),
      swLng: swLatLng.getLng(),
      neLat: neLatLng.getLat(),
      neLng: neLatLng.getLng(),
    };
  };

  // 주소를 x,y 좌표 변환 함수
  const addressToCoords = async (
    address: string
  ): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          if (result && result[0]) {
            resolve({
              lat: parseFloat(result[0].y),
              lng: parseFloat(result[0].x),
            });
          } else {
            reject(new Error('No results found'));
          }
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  };

  //마커 표시함수
  const displayStoreMarkers = useCallback(
    async (stores: Store[]) => {
      if (!map) return;

      // 기존 마커들의 주소를 저장할 Set
      const existingAddresses = new Set(
        storeMarkers.map((marker) => marker.getTitle())
      );

      const newMarkers: (typeof window.kakao.maps.Marker)[] = [...storeMarkers];

      for (const store of stores) {
        try {
          // 이미 해당 주소의 마커가 있다면 건너뛰기
          if (existingAddresses.has(store.address)) {
            continue;
          }

          if (store.address) {
            try {
              let coords;
              try {
                coords = await addressToCoords(store.address);
              } catch (error) {
                console.warn(
                  `주소 변환 실패 (${store.name}): ${store.address}`
                );
                continue; // 이 가게는 건너뛰고 다음 가게로 진행
              }

              const position = new window.kakao.maps.LatLng(
                coords.lat,
                coords.lng
              );

              const marker = new window.kakao.maps.Marker({
                position,
                map,
                title: store.address, // 마커에 주소를 식별자로 저장
              });

              const infowindow = new window.kakao.maps.InfoWindow({
                content: `
                <div class="p-4 w-64 relative">
                  <h3 class="m-0 text-base font-bold pr-6">${store.name || 'Unnamed'}</h3>
                  <p class="my-1 text-sm text-gray-600">
                    ${store.address}<br/>
                    ${store.phone || 'No phone number'}<br/>
                    Hours: ${store.open_time || '00:00'} - ${store.close_time || '00:00'}
                  </p>
                </div>
              `,
              });

              window.kakao.maps.event.addListener(marker, 'click', () => {
                if (currentInfoWindow.current) {
                  currentInfoWindow.current.close();
                }
                infowindow.open(map, marker);
                currentInfoWindow.current = infowindow;
              });

              newMarkers.push(marker);
            } catch (error) {
              console.error(
                `Failed to geocode address for ${store.name}:`,
                error
              );
            }
          }
        } catch (error) {
          console.error(`Error processing store ${store.name}:`, error);
        }
      }

      setStoreMarkers(newMarkers);
    },
    [map, storeMarkers, addressToCoords]
  );

  // 현재 위치를 가져오는 함수
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      // 옵션 추가
      const options = {
        enableHighAccuracy: true, // 높은 정확도
        timeout: 5000, // 5초 타임아웃
        maximumAge: 0, // 캐시된 위치정보를 사용하지 않음
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (map) {
            const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
            map.setCenter(moveLatLng);

            if (marker) {
              marker.setMap(null);
            }

            const newMarker = new window.kakao.maps.Marker({
              position: moveLatLng,
              map: map,
            });
            setMarker(newMarker);

            const infowindow = new window.kakao.maps.InfoWindow({
              content: '<div style="padding:5px;">현재 위치</div>',
            });
            infowindow.open(map, newMarker);
          }
        },
        (error) => {
          // 상세한 에러 메시지
          let errorMessage;
          switch (error.code) {
            case 1:
              errorMessage =
                '위치 정보 권한이 거부되었습니다. 브라우저 설정에서 위치 정보 접근 권한을 허용해주세요.';
              break;
            case 2:
              errorMessage =
                '위치 정보를 가져올 수 없습니다. 다시 시도해주세요.';
              break;
            case 3:
              errorMessage =
                '위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.';
              break;
            default:
              errorMessage =
                '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.';
          }
          console.error('위치 정보 에러:', error);
          alert(errorMessage);
        },
        options // 옵션 적용
      );
    } else {
      alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
    }
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);

        // 1. 스크립트 로드
        await loadKakaoMapsScript();

        // 2. 맵 생성 전 확인
        if (!mapRef.current) {
          console.error('Map ref not found');
          return;
        }

        // 3. 맵 생성
        const options = {
          center: new window.kakao.maps.LatLng(location.lat, location.lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);

        // 4. 컨트롤 추가
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(
          mapTypeControl,
          window.kakao.maps.ControlPosition.TOPRIGHT
        );

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        // 5. 초기 마커 생성
        const initialMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(location.lat, location.lng),
          map: map,
        });
        setMarker(initialMarker);

        // 맵 인스턴스 설정 (한 번만)
        setMapInstance(map);

        // 6. 현재 viewport의 스토어 데이터 로드 및 마커 표시
        const bounds = getMapBounds(map);
        const params = new URLSearchParams({
          swLat: bounds.swLat.toString(),
          swLng: bounds.swLng.toString(),
          neLat: bounds.neLat.toString(),
          neLng: bounds.neLng.toString(),
        });

        const response = await fetch(`/api/store/getstore?${params}`);
        if (response.ok) {
          const stores = await response.json();
          displayStoreMarkers(stores);
        }

        // 7. 지도 이동 이벤트 리스너 추가
        window.kakao.maps.event.addListener(map, 'idle', () => {
          const newBounds = getMapBounds(map);

          const newParams = new URLSearchParams({
            swLat: newBounds.swLat.toString(),
            swLng: newBounds.swLng.toString(),
            neLat: newBounds.neLat.toString(),
            neLng: newBounds.neLng.toString(),
          });

          fetch(`/api/store/getstore?${newParams}`)
            .then((response) => response.json())
            .then((stores) => {
              displayStoreMarkers(stores);
            })
            .catch((error) =>
              console.error('스토어 데이터 가져오기 오류:', error)
            );
        });
      } catch (error) {
        console.error('지도 초기화 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [location]);

  useEffect(() => {
    if (map) {
      const bounds = getMapBounds(map);
      const params = new URLSearchParams({
        swLat: bounds.swLat.toString(),
        swLng: bounds.swLng.toString(),
        neLat: bounds.neLat.toString(),
        neLng: bounds.neLng.toString(),
      });

      fetch(`/api/store/getstore?${params}`)
        .then((response) => response.json())
        .then((stores) => {
          displayStoreMarkers(stores);
        })
        .catch((error) => console.error('스토어 데이터 가져오기 오류:', error));

      const moveLatLng = new window.kakao.maps.LatLng(
        location.lat,
        location.lng
      );
      map.setCenter(moveLatLng);
      map.panTo(moveLatLng);
    } else {
      console.warn('⚠️ map이 아직 생성되지 않음, 마커 표시 보류');
    }
  }, [map, location]);

  return (
    <div style={{ position: 'relative', width: '99vw', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <button
        onClick={getCurrentLocation}
        style={{
          position: 'absolute',
          right: '2px',
          top: '232px',
          width: '32px',
          height: '32px',
          backgroundColor: 'white',
          borderRadius: '2px',
          boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
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
