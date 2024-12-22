"use client";

import Image from "next/image";

export function BilliardRoomImage() {
  return (
    <div className="p-2">
      <Image
        alt="당구장 이미지"
        src="/main/예시이미지.png"
        width={124}
        height={124}
        className="rounded-lg border-none"
      />
    </div>
  );
}
