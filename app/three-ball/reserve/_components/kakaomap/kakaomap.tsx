"use client";

import { useEffect, useRef, useState } from "react";
import { loadKakaoMapsScript } from "@/lib/loadKakaoMap";

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<typeof window.kakao.maps.Map | null>(null);
  const [marker, setMarker] = useState<typeof window.kakao.maps.Marker | null>(
    null
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
                "위치 정보 권한이 거부되었습니다. 브라우저 설정에서 위치 정보 접근 권한을 허용해주세요.";
              break;
            case 2:
              errorMessage =
                "위치 정보를 가져올 수 없습니다. 다시 시도해주세요.";
              break;
            case 3:
              errorMessage =
                "위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.";
              break;
            default:
              errorMessage =
                "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.";
          }
          console.error("위치 정보 에러:", error);
          alert(errorMessage);
        },
        options // 옵션 적용
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  };

  useEffect(() => {
    const initMap = async () => {
      await loadKakaoMapsScript();

      await new Promise<void>((resolve) => {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;

          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };

          const newMap = new window.kakao.maps.Map(mapRef.current, options);
          setMap(newMap);

          // 지도 타입 컨트롤 추가
          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          newMap.addControl(
            mapTypeControl,
            window.kakao.maps.ControlPosition.TOPRIGHT
          );

          // 줌 컨트롤 추가
          const zoomControl = new window.kakao.maps.ZoomControl();
          newMap.addControl(
            zoomControl,
            window.kakao.maps.ControlPosition.RIGHT
          );

          resolve();
        });
      });
    };

    initMap();
  }, []);

  return (
    <div style={{ position: "relative", width: "99vw", height: "100vh" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <button
        onClick={getCurrentLocation}
        style={{
          position: "absolute",
          right: "2px",
          top: "232px",
          width: "32px",
          height: "32px",
          backgroundColor: "white",
          borderRadius: "2px",
          boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
