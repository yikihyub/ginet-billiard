// "use client";

// import { useEffect, useRef } from "react";
// import { loadKakaoMapsScript } from "@/lib/loadKakaoMap";

// export default function KakaoMap() {
//   const mapRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const initMap = async () => {
//       await loadKakaoMapsScript();

//       // 스크립트 로드 후 maps 객체 초기화 대기
//       await new Promise<void>((resolve) => {
//         window.kakao.maps.load(() => {
//           if (!mapRef.current) return;

//           const options = {
//             center: new window.kakao.maps.LatLng(37.5665, 126.978),
//             level: 3,
//           };

//           new window.kakao.maps.Map(mapRef.current, options);
//           resolve();
//         });
//       });
//     };

//     initMap();
//   }, []);

//   return <div ref={mapRef} style={{ width: "99vw", height: "100vh" }} />;
// }
