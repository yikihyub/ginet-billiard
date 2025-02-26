'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { useLocation } from '../../../_components/context/location-context';

import { MBilliardRoomCardProps } from '@/types/(reserve)';

export function BilliardRoomCard({
  room,
  onCloseDrawer,
}: MBilliardRoomCardProps) {
  const { setLocation } = useLocation();

  const handleLocationClick = async () => {
    if (!room.address) return;

    try {
      // 카카오 지도 서비스 초기화
      const geocoder = new window.kakao.maps.services.Geocoder();

      // 주소로 좌표 검색
      geocoder.addressSearch(room.address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = {
            lat: Number(result[0].y),
            lng: Number(result[0].x),
          };

          // Context를 통해 위치 업데이트
          setLocation(coords.lat, coords.lng);

          // Drawer 닫기
          onCloseDrawer();
        }
      });
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="p-3">
        <Image
          alt="당구장 이미지"
          src="/main/예시이미지.png"
          width={124}
          height={124}
          className="rounded-lg border-none"
        />
      </div>
      <div
        className="flex w-full flex-col justify-between gap-1 p-3"
        onClick={handleLocationClick}
      >
        <div>
          <div className="text-lg font-semibold">{room.name}</div>
          <div className="text-sm text-[#9fa6aa]">{room.address}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Badge className="text-xs font-medium" variant="secondary">
              3구
            </Badge>
            <Badge className="text-xs font-medium" variant="secondary">
              4구
            </Badge>
            <Badge className="text-xs font-medium" variant="secondary">
              포켓볼
            </Badge>
            <Badge className="text-xs font-medium" variant="secondary">
              국제식
            </Badge>
          </div>
        </div>
        <div className="mt-1 flex w-full justify-end">
          <Link
            href={`/billiard-place/detail/${room.id}`}
            className="flex items-center text-sm transition-colors hover:text-blue-500"
          >
            자세히 보기 <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
