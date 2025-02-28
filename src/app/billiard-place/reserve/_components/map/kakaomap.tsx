'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from '../context/location-context';
import { Store } from '@/types/(reserve)';
import debounce from 'lodash/debounce';
import { MapBounds } from '@/types/(kakaomap)/kakao';
import {
  loadKakaoMapsScript,
  getMapBounds,
  createMarkerImage,
  fetchStores,
  getCurrentLocation,
} from '@/lib/kakaomap';

export default function KakaoMap() {
  const { location, setLocation, setBounds } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<typeof window.kakao.maps.Map | null>(null);
  const currentMarker = useRef<typeof window.kakao.maps.Marker | null>(null);
  const storeMarkers = useRef<(typeof window.kakao.maps.Marker)[]>([]);
  const currentInfoWindow = useRef<typeof window.kakao.maps.InfoWindow | null>(
    null
  );

  if (isLoading) {
    <div>loading...</div>;
  }

  const displayStoreMarkers = useCallback(async (stores: Store[]) => {
    if (!mapInstance.current) return;

    storeMarkers.current.forEach((marker) => marker.setMap(null));
    storeMarkers.current = [];

    const markerImage = createMarkerImage();

    stores.forEach((store) => {
      const position = new window.kakao.maps.LatLng(
        store.latitude,
        store.longitude
      );
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstance.current,
        image: markerImage,
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div class="relative p-4 w-64">
            <h3 class="text-base font-bold">${store.name}</h3>
            <p class="text-sm text-gray-600">${store.address}</p>
          </div>
        `,
        removable: true,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        currentInfoWindow.current?.close();
        infoWindow.open(mapInstance.current!, marker);
        currentInfoWindow.current = infoWindow;
      });

      storeMarkers.current.push(marker);
    });
  }, []);

  const debouncedFetchStores = useCallback(
    debounce(
      (bounds: MapBounds) => fetchStores(bounds, displayStoreMarkers),
      500
    ),
    [displayStoreMarkers]
  );

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        await loadKakaoMapsScript();

        if (!mapRef.current) throw new Error('Map ref not found');

        const options = {
          center: new window.kakao.maps.LatLng(location.lat, location.lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        mapInstance.current = map;

        map.addControl(
          new window.kakao.maps.MapTypeControl(),
          window.kakao.maps.ControlPosition.TOPRIGHT
        );
        map.addControl(
          new window.kakao.maps.ZoomControl(),
          window.kakao.maps.ControlPosition.RIGHT
        );

        const handleMapChange = () => {
          if (!map) return;
          setLocation(
            map.getCenter().getLat(),
            map.getCenter().getLng(),
            map.getLevel()
          );
          const bounds = getMapBounds(map);
          setBounds(bounds);
          debouncedFetchStores(bounds);
        };

        window.kakao.maps.event.addListener(map, 'dragend', handleMapChange);
        window.kakao.maps.event.addListener(
          map,
          'zoom_changed',
          handleMapChange
        );

        const bounds = getMapBounds(map);
        await fetchStores(bounds, displayStoreMarkers);
      } catch (error) {
        console.error('Map initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setCenter(
      new window.kakao.maps.LatLng(location.lat, location.lng)
    );

    const bounds = getMapBounds(mapInstance.current);
    debouncedFetchStores(bounds);
  }, [location, debouncedFetchStores]);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapRef} className="h-full w-[100%]" />
      <button
        onClick={() =>
          getCurrentLocation(mapInstance.current!, currentMarker.current)
        }
        className="absolute right-2 top-[232px] z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-white shadow-sm"
        aria-label="Get current location"
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
