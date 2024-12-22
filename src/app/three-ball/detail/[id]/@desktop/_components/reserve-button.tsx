import React from "react";

export default function ReserveButton() {
  return (
    <div className="w-[400px] shrink-0">
      <div className="sticky top-6 bg-white border p-6 space-y-4">
        <div>
          <div className="text-xl font-bold">12월 16일 월요일 17:00</div>
          <h2 className="text-lg font-semibold mt-2">
            서울 송파 전마 풋살파크 2구장
          </h2>
          <div className="text-sm text-gray-600">
            서울 송파구 성내천로29길 31
            <button className="ml-2 text-blue-500">지도 보기</button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span>👀 123</span>
            <span>❤️ 0</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold">10,000원</span>
            <span className="text-gray-500">/ 2시간</span>
          </div>
          <p className="text-red-500 text-sm mt-1">
            매치 시작 10분 전 신청이 마감돼요
          </p>
        </div>

        <div className="p-4 bg-emerald-50 rounded-lg">
          <p className="text-emerald-600">
            ✨ 대부분의 공급중을 모두 혜택받으세요
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">마감까지</p>
          <p className="text-red-500 font-bold">8자리 남았어요!</p>
        </div>

        <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold">
          예약하기
        </button>
      </div>
    </div>
  );
}
