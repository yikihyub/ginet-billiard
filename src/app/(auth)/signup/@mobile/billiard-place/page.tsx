'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

import { SearchIcon } from 'lucide-react';
import KakaoMap from '@/app/three-ball/reserve/_components/map/kakaomap';

import { LocationProvider } from '@/app/three-ball/reserve/_components/context/location-context';

export default function BilliardPlace() {
  const [isOpen, setIsOpen] = useState(false);
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(
    ({
      movement: [mx, my],
      velocity: [vx, vy],
      direction: [dx, dy],
      cancel,
    }) => {
      // mx, vx, dx는 사용하지 않지만 다른 변수명 사용
      if (my < -50 || (vy < -0.5 && dy < 0)) {
        setIsOpen(true);
        cancel();
      } else if (my > 50 || (vy > 0.5 && dy > 0)) {
        setIsOpen(false);
        cancel();
      }
      api.start({ y: isOpen ? -400 : 0 });
    }
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 검색 영역 */}
      <div className="p-4 pt-16">
        <div className="relative">
          <input
            type="text"
            placeholder="장소, 주소를 검색해주세요."
            className="w-full rounded-lg bg-gray-50 p-4 pr-12"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 카카오맵 영역 */}
      <div className="h-[calc(100vh-180px)]">
        <LocationProvider>
          <KakaoMap />
        </LocationProvider>
      </div>

      {/* 하단 버튼 영역 */}
      <animated.div
        {...bind()}
        style={{
          y,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          touchAction: 'none',
        }}
        className="z-50 rounded-t-2xl border-t bg-white shadow-lg"
      >
        {/* 스와이프 핸들 */}
        <div className="flex justify-center p-2">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        {/* 버튼 영역 */}
        <div className="p-4">
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg border border-blue-500 py-4 text-blue-500">
              비구클럽만 보기
            </button>
            <button className="flex-1 rounded-lg bg-gray-500 py-4 text-white">
              즐겨찾는 클럽으로 설정
            </button>
          </div>
        </div>

        {/* Sheet 컨텐츠 */}
        <div className="max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto p-4">
          <div className="space-y-2">
            {/* 당구장 목록 items */}
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">군캐롬클럽</h4>
              <p className="text-sm text-gray-600">
                서울 용산구 효창원로 62길 16, 3층
              </p>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
}
