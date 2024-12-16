interface Window {
  kakao: {
    maps: {
      Map: any;
      Marker: any;
      LatLng: any;
      load: (callback: () => void) => void;
      InfoWindow: any;
      MapTypeControl: any;
      ZoomControl: any;
      ControlPosition: {
        TOPRIGHT: number;
        RIGHT: number;
      };
      CustomControl: any;
    };
  };
}
