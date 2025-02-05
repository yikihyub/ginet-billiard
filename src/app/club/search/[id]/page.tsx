'use client';

import Image from 'next/image';
import { MapPin, UserRound, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClubDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-[100vh] bg-white">
      {/* 메인 컨텐츠 */}
      <div>
        {/* 커버 이미지 */}
        <div className="relative h-48 w-full md:h-64">
          <Image
            src="/logo/billard_web_banner.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        {/* 동호회 정보 */}
        <div className="space-y-6 p-4">
          {/* 기본 정보 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold">용산 당구 동호회</h2>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">용산구</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserRound className="h-4 w-4" />
                <span className="text-sm">23/50명</span>
              </div>
            </div>
          </div>

          {/* 당구 종류 태그 */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              4구 중대
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              3구 중대
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              포켓볼
            </span>
          </div>

          {/* 동호회 소개 */}
          <div>
            <h3 className="mb-2 font-semibold">동호회 소개</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              용산에서 활동하는 당구 동호회입니다. 주 1회 정기모임을 가지며,
              실력과 관계없이 당구를 사랑하는 분들과 함께 즐겁게 운동하고
              있습니다.
            </p>
          </div>

          {/* 동호회 규칙 */}
          <div>
            <h3 className="mb-2 font-semibold">동호회 규칙</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 월 회비 1만원</li>
              <li>• 주 1회 정기모임 참석</li>
              <li>• 불참 시 하루 전까지 연락</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 하단 가입 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <button className="w-full rounded-lg bg-blue-500 py-4 font-semibold text-white">
          가입 신청하기
        </button>
      </div>
    </div>
  );
}
