export function loadKakaoMapsScript(): Promise<void> {
  const KAKAO_MAP_API = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  return new Promise((resolve) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API}&autoload=false`;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
