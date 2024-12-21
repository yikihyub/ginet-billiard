"use client";

import Link from "next/link";

export default function Step5() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        자주 가는 당구장을 <br /> 등록해주세요!
      </h2>

      <div className="">
        <button className="w-full p-4 bg-blue-500 text-white rounded-lg">
          <Link href="/signup/billiard-place" className="block w-full">
            클럽 추가하기
          </Link>
        </button>
        <p className="text-center text-sm text-gray-500 mt-2">
          클럽은 최대 30개까지 추가 가능합니다
        </p>
      </div>
    </div>
  );
}
