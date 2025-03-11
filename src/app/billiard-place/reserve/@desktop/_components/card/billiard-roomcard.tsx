'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, Phone, Star } from 'lucide-react';
import { useLocation } from '../../../_components/context/location-context';

import Image from 'next/image';
import Link from 'next/link';

import { BilliardRoomCardProps } from '@/types/(reserve)';

export function BilliardRoomCard({ room }: BilliardRoomCardProps) {
  const { userId, setLocation } = useLocation();
  const [isFavorite, setIsFavorite] = useState(room.is_favorite || false);

  const handleLocationClick = async () => {
    if (!room.address) return;

    if (userId) {
      try {
        // 당구장 이름을 검색어로 사용하고, 당구장 ID도 함께 저장
        await fetch('/api/recentsearch/addrecentsearch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            searchTerm: room.name, // 당구장 이름을 검색어로 사용
            placeId: room.id,
          }),
        });
      } catch (error) {
        console.error('최근 검색 추가 중 오류 발생:', error);
        // 오류가 발생해도 사용자 경험에 영향을 주지 않도록 무시
      }
    }

    try {
      // 카카오 지도 서비스 초기화
      const geocoder = new window.kakao.maps.services.Geocoder();

      // 주소로 좌표 검색
      geocoder.addressSearch(room.address, (result: any, status: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = {
            lat: Number(result[0].y),
            lng: Number(result[0].x),
          };

          // Context를 통해 위치 업데이트
          setLocation(coords.lat, coords.lng, 1);
        }
      });
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지

    try {
      if (isFavorite) {
        // 즐겨찾기 삭제
        const response = await fetch(
          `/api/favorite/deletefavorite?userId=${userId}&placeId=${room.id}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('즐겨찾기 삭제 중 오류 발생');
        }

        setIsFavorite(false);
      } else {
        // 즐겨찾기 추가
        const response = await fetch('/api/favorite/postfavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            placeId: room.id,
          }),
        });

        if (!response.ok) {
          throw new Error('즐겨찾기 추가 중 오류 발생');
        }

        setIsFavorite(true);
      }
    } catch (error) {
      console.error('즐겨찾기 토글 중 오류 발생:', error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex w-full flex-col bg-white py-4">
        <div onClick={handleLocationClick} className="flex w-full">
          {/* 텍스트 정보 (2칸) */}
          <div className="flex w-[244px] flex-col justify-between">
            <div className="flex items-center">
              <div className="line-clamp-1 text-lg font-semibold">
                {room.name}
              </div>
              {/* 즐겨찾기 버튼 추가 */}
              <button
                onClick={toggleFavorite}
                className="ml-2 focus:outline-none"
                aria-label={isFavorite ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
              >
                <Star
                  className={`h-5 w-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-400">{room.address}</p>

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
          href={`/billiard-place/detail/${room.id}`}
          className="mt-4 flex items-center text-sm text-blue-600 transition-colors hover:text-blue-700"
        >
          자세히 보기 <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
