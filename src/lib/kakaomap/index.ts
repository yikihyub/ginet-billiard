import { Store } from '@/types/(reserve)';
import { MapBounds } from '@/types/(kakaomap)/kakao';
import { Coordinates } from '@/types/(match)';

// x,y 좌표 변환
export const addressToCoords = async (
  address: string
): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.kakao.maps.services.Geocoder();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// map script
export function loadKakaoMapsScript(): Promise<void> {
  const KAKAO_MAP_API = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  return new Promise<void>((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API}&libraries=services,clusterer&autoload=false`;
    script.onload = () => resolve();

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };

    script.onerror = (error) => {
      reject(error);
    };

    document.head.appendChild(script);
  });
}

// map boundary
export function getMapBounds(map: typeof window.kakao.maps.Map): MapBounds {
  const bounds = map.getBounds();
  return {
    swLat: bounds.getSouthWest().getLat(),
    swLng: bounds.getSouthWest().getLng(),
    neLat: bounds.getNorthEast().getLat(),
    neLng: bounds.getNorthEast().getLng(),
  };
}

// 이미지 변환
export function createMarkerImage() {
  const imageSrc = '/marker/marker.png';
  const imageSize = new window.kakao.maps.Size(42, 49);
  const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

  return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
}

// 당구장 불러오기
export async function fetchStores(
  bounds: MapBounds,
  callback: (stores: Store[]) => void
) {
  try {
    const params = new URLSearchParams(
      bounds as unknown as Record<string, string>
    );
    const response = await fetch(`/api/store/getstore?${params}`);

    if (!response.ok) throw new Error('Failed to fetch stores');

    const stores = await response.json();
    callback(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
  }
}

// 현재 위치 불러오기기
export function getCurrentLocation(
  mapInstance: typeof window.kakao.maps.Map,
  currentMarker: typeof window.kakao.maps.Marker | null
) {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
      mapInstance.setCenter(moveLatLng);

      if (currentMarker) currentMarker.setMap(null);
      const marker = new window.kakao.maps.Marker({
        position: moveLatLng,
        map: mapInstance,
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: '<div style="padding:5px;">Current Location</div>',
      });
      infoWindow.open(mapInstance, marker);
    },
    (error) => {
      const errorMessages = {
        1: 'Permission denied. Please enable location services.',
        2: 'Position unavailable. Please try again.',
        3: 'Request timeout. Please try again.',
      };

      alert(
        errorMessages[error.code as keyof typeof errorMessages] ||
          'Unknown error occurred.'
      );
      console.error('Geolocation error:', error);
    }
  );
}

/**
 * 카카오맵 API를 사용하여 두 좌표 사이의 거리를 계산합니다.
 * @param origin 출발 좌표
 * @param destination 도착 좌표
 * @returns 거리 (미터 단위)
 */
export const calculateDistanceWithKakao = async (
  origin: Coordinates,
  destination: Coordinates
): Promise<number> => {
  
// 환경 변수에서 API 키 가져오기
const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || '';
  try {
    // API 키가 없는 경우 기본 Haversine 공식 사용
    if (!KAKAO_REST_API_KEY) {
      console.warn('카카오 API 키가 설정되지 않았습니다. 기본 거리 계산 방식을 사용합니다.');
      return calculateHaversineDistance(origin, destination);
    }
    
    // 카카오 좌표계 변환 API 사용
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${origin.longitude}&y=${origin.latitude}&output_coord=WGS84`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    // API 응답 처리
    const data = await response.json();
    
    // 응답이 유효한지 확인
    if (!data || !data.documents || data.documents.length === 0) {
      console.warn('카카오 API 응답이 유효하지 않습니다. 기본 거리 계산 방식을 사용합니다.');
      return calculateHaversineDistance(origin, destination);
    }

    // 변환된 좌표 사용
    const transformedOrigin = {
      latitude: data.documents[0].y,  // y가 위도(latitude)
      longitude: data.documents[0].x  // x가 경도(longitude)
    };
    
    // 변환된 좌표로 거리 계산
    return calculateHaversineDistance(transformedOrigin, destination);
  } catch (error) {
    console.error('카카오 API 호출 중 오류:', error);
    // API 오류 시 기본 공식으로 대체
    return calculateHaversineDistance(origin, destination);
  }
};

/**
 * Haversine 공식을 사용하여 두 지점 간의 거리를 계산합니다.
 * @param origin 출발 좌표
 * @param destination 도착 좌표
 * @returns 거리 (미터 단위)
 */
export const calculateHaversineDistance = (
  origin: Coordinates,
  destination: Coordinates
): number => {
  // 좌표 유효성 검사
  if (!isValidCoordinate(origin) || !isValidCoordinate(destination)) {
    console.error('유효하지 않은 좌표:', { origin, destination });
    return Infinity;
  }

  // 지구 반경 (미터)
  const R = 6371e3; 
  
  // 라디안으로 변환
  const lat1 = (origin.latitude * Math.PI) / 180;
  const lat2 = (destination.latitude * Math.PI) / 180;
  const lon1 = (origin.longitude * Math.PI) / 180;
  const lon2 = (destination.longitude * Math.PI) / 180;
  
  // 위도, 경도 차이
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  
  // Haversine 공식
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 미터 단위 거리
  
  // 디버깅
  console.log('거리 계산 결과:', Math.round(distance), '미터');
  
  return distance;
};

/**
 * 좌표가 유효한지 확인하는 헬퍼 함수
 */
export const isValidCoordinate = (coord: any): boolean => {
  // 객체가 존재하고 latitude, longitude 속성이 숫자인지 확인
  return (
    coord && 
    typeof coord === 'object' &&
    'latitude' in coord && 
    'longitude' in coord &&
    typeof coord.latitude === 'number' &&
    typeof coord.longitude === 'number' &&
    !isNaN(coord.latitude) &&
    !isNaN(coord.longitude) &&
    Math.abs(coord.latitude) <= 90 && // 위도는 -90° ~ 90° 사이여야 함
    Math.abs(coord.longitude) <= 180 // 경도는 -180° ~ 180° 사이여야 함
  );
};

/**
 * 두 좌표 사이의 거리를 계산합니다.
 * 카카오 API 가능하면 사용하고, 실패하면 Haversine 공식을 사용합니다.
 * @param origin 출발 좌표
 * @param destination 도착 좌표
 * @returns 거리 (미터 단위)
 */
export const calculateDistance = async (
  origin: Coordinates,
  destination: Coordinates
): Promise<number> => {
  try {
    return await calculateDistanceWithKakao(origin, destination);
  } catch (error) {
    console.warn('카카오 API 거리 계산 실패, Haversine 공식으로 계산합니다:', error);
    return calculateHaversineDistance(origin, destination);
  }
};