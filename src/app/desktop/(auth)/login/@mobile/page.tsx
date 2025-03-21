'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const [isPersonal, setIsPersonal] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await signIn('credentials', {
        user_id: formData.get('user_id') as string,
        userpw: formData.get('userpw') as string,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      router.push(from);
    } catch (error) {
      setError('로그인 처리 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-4">
      {/* 로고 */}
      <div className="mb-8 mt-16 flex justify-center">
        <div className="relative">
          <Image src="/logo/logo3.png" alt="로고" width={160} height={100} />
        </div>
      </div>

      {/* 회원 유형 선택 */}
      <div className="mb-8 flex justify-center">
        <div className="flex-1 text-center">
          <button
            className={cn(
              'pb-2',
              isPersonal
                ? 'border-b-2 border-green-600 text-lg font-bold text-green-600'
                : 'text-gray-400'
            )}
            onClick={() => setIsPersonal(true)}
          >
            일반
          </button>
        </div>
        <div className="flex-1 text-center">
          <button
            className={cn(
              'pb-2',
              !isPersonal
                ? 'border-b-2 border-green-600 text-lg font-bold text-green-600'
                : 'text-gray-400'
            )}
            onClick={() => setIsPersonal(false)}
          >
            사장님
          </button>
        </div>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            name="user_id"
            type="email"
            placeholder="이메일"
            className="w-full rounded-lg border bg-white p-4"
            required
          />
          <input
            name="userpw"
            type="password"
            placeholder="비밀번호"
            className="w-full rounded-lg border bg-white p-4"
            required
          />

          {/* 자동 로그인 체크박스 */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="rounded-sm border-gray-300" />
            <label className="text-sm text-gray-600">자동 로그인</label>
          </div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            className="mt-4 h-14 w-full rounded-lg bg-green-600 text-lg font-semibold hover:bg-green-700"
          >
            로그인
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
      {/* 하단 링크들 */}
      <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500">
        <button>아이디 찾기</button>
        <span className="text-gray-300">|</span>
        <button>비밀번호 찾기</button>
        <span className="text-gray-300">|</span>
        <button onClick={() => router.push('/signin')}>회원가입</button>
      </div>

      {/* 소셜 로그인 섹션 */}
      <div className="mt-6">
        <div className="relative mb-4 flex items-center text-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 flex-shrink-0 text-sm text-gray-500">
            소셜 아이디로 간편 로그인
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          {/* 카카오 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAE100]">
            <MessageCircle fill="#211C20" />
          </div>

          {/* 네이버 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#03C75A]">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
        </div>
      </div>
    </div>
  );
}
