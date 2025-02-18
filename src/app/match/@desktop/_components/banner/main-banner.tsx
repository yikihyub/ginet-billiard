import React from 'react';
import Image from 'next/image';

export default function MainBanner() {
  return (
    <>
      <div className="relative w-full">
        {/* 배경 이미지 */}
        <div className="relative h-[160px] w-full overflow-hidden sm:h-[240px]">
          <Image
            alt="매칭베너"
            src="/main/매칭베너.jpg"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />

          {/* 텍스트 오버레이 */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h1 className="mb-2 text-2xl font-bold">상대찾기</h1>
            <p className="text-gray-200">
              상대 플레이어를 찾고 싶을때 상대찾기!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
