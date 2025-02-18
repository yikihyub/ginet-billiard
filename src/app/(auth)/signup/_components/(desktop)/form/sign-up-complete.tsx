'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  MapPin,
  Users2,
  CalendarClock,
  GraduationCap,
  Home,
} from 'lucide-react';

import Image from 'next/image';

export default function SignupComplete() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      {/* 완료 메시지 */}
      <div className="space-y-4 text-center">
        <div className="relative inline-block">
          <Image
            src="/logo/회원가입완료.png"
            width={150}
            height={100}
            alt="sign in logo"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">회원가입 완료</h1>
          <p className="text-gray-600">이제 아래 서비스를 시작해보세요!</p>
        </div>
      </div>

      {/* 가능한 활동 안내 */}
      <div className="grid w-full max-w-md grid-cols-1 gap-4">
        <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <MapPin className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold">주변 당구장 찾기</h3>
              <p className="text-sm text-gray-500">
                내 주변의 당구장을 둘러보세요
              </p>
            </div>
          </div>
        </div>

        <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <Users2 className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold">매칭 시작하기</h3>
              <p className="text-sm text-gray-500">
                함께 당구 칠 상대를 찾아보세요
              </p>
            </div>
          </div>
        </div>

        <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
              <CalendarClock className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold">예약 시작하기</h3>
              <p className="text-sm text-gray-500">
                원하는 시간에 당구장을 예약하세요
              </p>
            </div>
          </div>
        </div>

        <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
              <GraduationCap className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold">당구 공부하기</h3>
              <p className="text-sm text-gray-500">기술과 전략을 배워보세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex w-full max-w-md flex-col gap-3">
        <Button
          className="h-12 bg-green-500 hover:bg-green-600"
          onClick={() => router.push('/match')}
        >
          매칭 시작하기
        </Button>

        <Button
          variant="outline"
          className="h-12"
          onClick={() => router.push('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          홈으로 이동
        </Button>
      </div>
    </div>
  );
}
