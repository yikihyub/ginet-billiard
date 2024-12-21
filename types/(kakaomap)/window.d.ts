interface Window {
  kakao: {
    maps: {
      Map: any;
      Marker: any;
      LatLng: any;
      LatLngBounds: any; // 추가
      load: (callback: () => void) => void;
      InfoWindow: any;
      MapTypeControl: any;
      ZoomControl: any;
      ControlPosition: {
        TOPRIGHT: number;
        RIGHT: number;
      };
      CustomControl: any;
      services: {
        // 추가
        Places: any;
        Status: {
          OK: any;
          ZERO_RESULT: any;
          ERROR: any;
        };
      };
    };
  };
}
