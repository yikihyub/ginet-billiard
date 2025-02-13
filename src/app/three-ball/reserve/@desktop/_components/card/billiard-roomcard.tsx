'use client';

import { ChevronRight, Clock, Phone } from 'lucide-react';
import { useLocation } from '../../../_components/context/location-context';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

import { BilliardRoomCardProps } from '@/types/(reserve)';

export function BilliardRoomCard({ room }: BilliardRoomCardProps) {
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
        }
      });
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex w-full flex-col bg-white py-2">
        <div onClick={handleLocationClick} className="flex w-full">
          {/* 텍스트 정보 (2칸) */}
          <div className="flex w-[244px] flex-col justify-between">
            <div>
              <div className="line-clamp-1 text-lg font-semibold">
                {room.name}
              </div>
              <p className="mt-1 text-sm text-gray-400">{room.address}</p>
            </div>

            <div className="mt-1 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-[#333]">
                <Clock className="h-3 w-3" />
                <span>
                  {room.open_time} - {room.close_time}
                </span>
              </div>

              {room.phone && (
                <div className="flex items-center gap-2 text-xs text-[#333]">
                  <Phone className="h-3 w-3" />
                  <span>{room.phone}</span>
                </div>
              )}
            </div>
            <div className="mt-1 flex justify-between px-2">
              <Badge className="font-medium" variant="secondary">
                3구
              </Badge>
              <Badge className="font-medium" variant="secondary">
                4구
              </Badge>
              <Badge className="font-medium" variant="secondary">
                포켓볼
              </Badge>
              <Badge className="font-medium" variant="secondary">
                국제식
              </Badge>
            </div>
          </div>

          {/* 이미지 (고정 너비 124px) */}
          <div className="flex w-[124px] justify-end">
            <Image
              alt="당구장 이미지"
              src="/main/예시이미지.png"
              width={124}
              height={124}
              className="rounded-lg border-none"
            />
          </div>
        </div>

        <Link
          href={`/three-ball/detail/${room.id}`}
          className="mt-4 flex items-center text-sm text-blue-600 transition-colors hover:text-blue-700"
        >
          자세히 보기 <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
