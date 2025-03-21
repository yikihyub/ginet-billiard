'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { MapPin, Users2, CalendarClock, GraduationCap } from 'lucide-react';

import Image from 'next/image';

export default function SignupComplete() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      {/* 완료 메시지 */}
      <div className="text-center">
        <div className="relative inline-block">
          <Image
            src="/logo/main_logo.png"
            width={150}
            height={100}
            alt="sign in logo"
          />
        </div>
        <div>
          <h1 className="text-center text-2xl font-bold">회원가입 완료</h1>
        </div>
      </div>

      {/* 가능한 활동 안내 */}
      <div className="grid w-full grid-cols-1 gap-4 p-4">
        <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-none transition-all hover:shadow-md">
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

        <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-none transition-all hover:shadow-md">
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

        <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-none transition-all hover:shadow-md">
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

        <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-none transition-all hover:shadow-md">
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
      <div className="fixed bottom-0 flex w-full max-w-md flex-col gap-3 p-4">
        <Button
          className="h-14 w-full bg-green-600 hover:bg-green-700"
          onClick={() => router.push('/mobile/login')}
        >
          로그인하기
        </Button>
      </div>
    </div>
  );
}
