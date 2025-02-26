import { Store } from '@/types/(reserve)';
import { MapBounds, KakaoMapEventListener } from '@/types/(kakaomap)/kakao';

// x,y 좌표 변환
export const addressToCoords = async (
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
