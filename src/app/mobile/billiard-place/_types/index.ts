import { ReactNode } from 'react';

export interface Store {
  longitude: string;
  latitude: string;
  id: number;
  name: string;
  business_no?: string;
  owner_name?: string;
  phone?: string;
  address?: string;
  open_time: string;
  close_time: string;
  comment?: string;
  hourly_rate?: number;
  per_minute?: number;
  least_rate?: number;
  open_yoil?: string;
  bi_id?: string;
  has_table?: number;
  directions?: string;
  parking_type?: string;
  parking_capacity?: number;
  parking_note?: string;
  weekend_rate?: number;
  brand?: string;
  facilities?: string;
  saturday_open?: string;
  saturday_close?: string;
  sunday_open?: string;
  sunday_close?: string;
  regular_holiday?: string;
  created_at?: Date;
  updated_at?: Date;
  is_favorite?: boolean;
}

// 컨텍스트 타입 정의
export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredRooms: Store[] | undefined;
  isLoading: boolean;
  error: Error | null;
  setLocation: (lat: number, lng: number, level: number) => void;
}

// 초기 상태 정의
export const initialSearchContext: SearchContextType = {
  searchQuery: '',
  setSearchQuery: () => {},
  filteredRooms: undefined,
  isLoading: false,
  error: null,
  setLocation: () => {},
};

export interface SearchProviderProps {
  children: ReactNode;
}

export interface StoreListProps {
  onCloseDrawer: () => void;
}

export interface MBilliardRoomCardProps {
  room: Store;
  onCloseDrawer: () => void;
}

// JSON 타입 정의
export type RegionData = {
  bjd_cd: number;
  center_long: number;
  center_lati: number;
  bjd_nm: string;
  sd_nm: string;
  sgg_nm: string;
  emd_nm: string;
};

export interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export interface LocationData {
  lat: number;
  lng: number;
  level: number; // ✅ level 추가
}

export interface LocationContextType {
  location: { lat: number; lng: number; level: number };
  bounds: MapBounds | null; // bounds 정보 추가
  setLocation: (lat: number, lng: number, level: number) => void;
  setBounds: (bounds: MapBounds) => void;
  userId?: string | null;
}