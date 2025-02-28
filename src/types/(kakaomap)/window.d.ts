// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Window {
  kakao: {
    maps: {
      Point: any;
      Map: any;
      Marker: any;
      MarkerImage: any;
      Size: any;
      LatLng: any;
      LatLngBounds: any;
      load: (callback: () => void) => void;
      InfoWindow: any;
      MapTypeControl: any;
      ZoomControl: any;
      MarkerClusterer: any;
      ControlPosition: {
        TOPRIGHT: number;
        RIGHT: number;
      };
      CustomControl: any;
      services: {
        Places: any;
        Status: {
          OK: any;
          ZERO_RESULT: any;
          ERROR: any;
        };
        Geocoder: new () => {
          addressSearch: (
            address: string,
            callback: (result: any[], status: any) => void
          ) => void;
          coord2Address: (
            lng: number,
            lat: number,
            callback: (
              result: Array<{
                address: {
                  address_name: string;
                  region_1depth_name: string;
                  region_2depth_name: string;
                  region_3depth_name: string;
                };
              }>,
              status: string
            ) => void
          ) => void;
        };
      };
      event: {
        removeListener(idleListener: void): unknown;
        addListener: (target: any, type: string, handler: () => void) => void;
      };
    };
  };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
