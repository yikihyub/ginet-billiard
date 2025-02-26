export interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export interface KakaoMapEventListener {
  remove(): void;
}
