"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

import { SearchIcon } from "lucide-react";
import KakaoMap from "@/app/three-ball/reserve/_components/kakaomap/kakaomap";

import { LocationProvider } from "@/app/three-ball/reserve/LocationContext";

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
      <div className="pt-16 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="장소, 주소를 검색해주세요."
            className="w-full p-4 pr-12 bg-gray-50 rounded-lg"
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
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          touchAction: "none",
        }}
        className="bg-white border-t shadow-lg rounded-t-2xl z-50"
      >
        {/* 스와이프 핸들 */}
        <div className="p-2 flex justify-center">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 버튼 영역 */}
        <div className="p-4">
          <div className="flex gap-2">
            <button className="flex-1 py-4 border rounded-lg border-blue-500 text-blue-500">
              비구클럽만 보기
            </button>
            <button className="flex-1 py-4 rounded-lg bg-gray-500 text-white">
              즐겨찾는 클럽으로 설정
            </button>
          </div>
        </div>

        {/* Sheet 컨텐츠 */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-2">
            {/* 당구장 목록 items */}
            <div className="p-4 border rounded-lg">
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
