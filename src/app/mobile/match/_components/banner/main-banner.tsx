'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function MainBanner() {
  const totalCount = 3;
  const [currentIndex, setCurrentIndex] = useState(1);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 1 ? prev - 1 : totalCount));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalCount ? prev + 1 : 1));
  };

  return (
    <>
      <div className="relative w-full bg-white">
        {/* 배경 이미지 */}
        <div className="relative h-[140px] w-full overflow-hidden rounded-md">
          <Image
            alt="매칭배너"
            src={`/ad/org${currentIndex}.png`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 네비게이션 컨트롤 */}
        <div className="absolute bottom-2 right-2 flex items-center space-x-2 rounded-md bg-black/60 px-3 py-1 text-sm text-white">
          <button
            onClick={handlePrev}
            className="px-2 py-1 hover:text-gray-300"
          >
            {'<'}
          </button>
          <span>
            {currentIndex} / {totalCount}
          </span>
          <button
            onClick={handleNext}
            className="px-2 py-1 hover:text-gray-300"
          >
            {'>'}
          </button>
        </div>
      </div>
      <div className="bg-white py-2">
        <p className="max-h-[120px] overflow-y-auto text-xs text-gray-600">
          * 최대 나의 주변 50km이내까지 Fluke회원에게 매칭 신청을 보낼 수
          있습니다.
        </p>
        <p className="max-h-[120px] overflow-y-auto text-xs text-gray-600">
          * 하루 최대 3회까지만 신청 할 수 있습니다.
        </p>
      </div>
    </>
  );
}
