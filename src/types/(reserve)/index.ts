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
}

// @desktop
export interface BilliardRoomCardProps {
  room: Store;
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

// @mobile
export interface MBilliardRoomCardProps {
  room: Store;
  onCloseDrawer: () => void;
}
