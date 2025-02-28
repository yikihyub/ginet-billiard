'use client';

import { useEffect, useRef, useState } from 'react';
import { loadKakaoMapsScript } from '@/lib/kakaomap';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

interface KakaoMapModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPlace: (place: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

export function KakaoMapModal({
  open,
  onClose,
  onSelectPlace,
}: KakaoMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchKeyword, setSearchKeyword] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  // 장소 검색 함수
  const searchPlaces = (keyword: string) => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword + ' 당구장', (data: any, status: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);

        // 검색된 장소들을 지도에 표시
        const bounds = new window.kakao.maps.LatLngBounds();
        data.forEach((place: any) => {
          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
        });
        map.setBounds(bounds);
      }
    });
  };

  useEffect(() => {
    const initMap = async () => {
      await loadKakaoMapsScript();

      await new Promise<void>((resolve) => {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;

          const options = {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3,
          };

          const newMap = new window.kakao.maps.Map(mapRef.current, options);
          setMap(newMap);

          // 지도 컨트롤 추가
          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          newMap.addControl(
            mapTypeControl,
            window.kakao.maps.ControlPosition.TOPRIGHT
          );

          const zoomControl = new window.kakao.maps.ZoomControl();
          newMap.addControl(
            zoomControl,
            window.kakao.maps.ControlPosition.RIGHT
          );

          resolve();
        });
      });
    };

    if (open) {
      initMap();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className="h-[80vh] max-w-3xl">
        <div className="h-full space-y-4">
          <h2 className="text-xl font-bold">당구장 검색</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && searchPlaces(searchKeyword)
              }
              placeholder="지역명으로 검색 (예: 강남역)"
              className="flex-1 rounded border p-2"
            />
            <button
              onClick={() => searchPlaces(searchKeyword)}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              검색
            </button>
          </div>

          <div className="flex h-[calc(100%-120px)]">
            <div ref={mapRef} className="h-full w-2/3" />
            <div className="h-full w-1/3 overflow-y-auto pl-4">
              {places.map((place) => (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  className="cursor-pointer border-b p-3 hover:bg-gray-50"
                >
                  <h3 className="font-medium">{place.place_name}</h3>
                  <p className="text-sm text-gray-600">{place.address_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
