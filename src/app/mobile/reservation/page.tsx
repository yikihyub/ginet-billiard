import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const ReservationPage = () => {
  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center border-b p-4">
        <h1 className="ml-4 text-lg font-semibold">예약 내역</h1>
        <div className="ml-auto flex items-center">
          <div className="flex items-center">
            <span className="text-sm">전체</span>
          </div>
          <svg className="ml-1 h-5 w-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      </div>

      {/* 예약 목록 */}
      <div className="flex-1 overflow-auto p-4">
        {/* 첫 번째 예약 항목 */}
        <div className="mb-4">
          <div className="mb-2 flex items-center">
            <X className="h-5 w-5 text-green-400" />
            <span className="ml-2 text-sm text-gray-500">예약 취소</span>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <p className="mb-1 text-sm">10월 07일 11:30</p>
            <p className="text-sm font-medium">골프존파크 서초방배사거리점</p>
            <div className="mt-2 flex justify-end">
              <span className="text-sm text-green-600">다시예약</span>
            </div>
          </div>
        </div>

        {/* 두 번째 예약 항목 */}
        <div className="mb-4">
          <div className="mb-2 flex items-center">
            <X className="h-5 w-5 text-green-400" />
            <span className="ml-2 text-sm text-gray-500">예약 취소</span>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <p className="mb-1 text-sm">10월 05일 00:00</p>
            <p className="text-sm font-medium">
              24시 프렌즈크런 스페이스 G 교대점
            </p>
            <div className="mt-2 flex justify-end">
              <span className="text-sm text-green-600">다시예약</span>
            </div>
          </div>
        </div>

        {/* 세 번째 예약 항목 (현재 예약) */}
        <div className="mb-4">
          <div className="mb-2 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="ml-2 text-sm text-gray-700">다가오는 예약</span>
          </div>
          <div className="rounded-md bg-green-600 p-4 text-white">
            <p className="mb-1 text-sm">10월 07일 00:00</p>
            <p className="text-sm font-medium">프렌즈골프 다자이너스존</p>
            <div className="mt-2 flex justify-end">
              <span className="text-sm">상세보기</span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 인디케이터 */}
      <div className="flex justify-center pb-8 pt-2">
        <div className="h-1 w-10 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default ReservationPage;
