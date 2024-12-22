import React from "react";
import Image from "next/image";

export default function MainBanner() {
  return (
    <>
      <div className="w-full relative mb-6">
        {/* 배경 이미지 */}
        <div className="relative w-full h-[160px] sm:h-[240px] rounded-2xl overflow-hidden">
          <Image
            alt="매칭베너"
            src="/main/매칭베너.jpg"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />

          {/* 텍스트 오버레이 */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            <h1 className="text-2xl font-bold mb-2">동호회 찾기</h1>
            <p className="text-gray-200">
              나에게 어울리는 동호회를 찾아서 등록해봐요.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
