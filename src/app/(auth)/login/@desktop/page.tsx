'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Mail, Apple, MessageSquare, Rss } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';
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
    <form onSubmit={handleSubmit}>
      <div className="flex h-screen flex-col items-center justify-center space-y-6 px-4">
        {/* 이메일 로그인 폼 */}
        <div className="w-full max-w-sm space-y-4">
          <input
            name="user_id"
            type="email"
            placeholder="이메일"
            className="w-full rounded-lg border p-3"
            required
          />
          <input
            name="userpw"
            type="password"
            placeholder="비밀번호"
            className="w-full rounded-lg border p-3"
            required
          />
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            로그인
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* 제목 */}
        <h1 className="text-center text-2xl font-bold">
          로그인 방법을 선택하세요
        </h1>

        {/* 로그인 버튼 그룹 */}
        <div className="w-full max-w-sm space-y-3">
          {/* 카카오로 계속하기 */}
          <Button
            className={cn(
              'w-full bg-[#FAE104] text-black hover:bg-yellow-500',
              'text-md rounded-lg py-6 font-semibold',
              'h-12'
            )}
          >
            <MessageSquare className="mr-2 h-6 w-6" />{' '}
            {/* 아이콘 크기 키우기 */}
            카카오 로그인
          </Button>

          {/* 네이버로 계속하기 */}
          <Button
            className={cn(
              'w-full border bg-[#02C75C] text-black shadow-none hover:bg-gray-100',
              'text-md rounded-lg py-6 font-semibold',
              'h-12'
            )}
          >
            <span className="mr-2 font-bold text-green-600">N</span>
            네이버 로그인
          </Button>

          {/* 구분선 */}
          <div className="relative flex items-center justify-center py-4">
            <Separator className="w-full" />
            <span className="absolute bg-white px-4 text-sm text-gray-500">
              또는
            </span>
          </div>

          {/* 이메일 로그인 */}
          <Button
            className={cn(
              'w-full border bg-white text-black shadow-none hover:bg-gray-100',
              'text-md rounded-lg py-6 font-semibold',
              'h-12'
            )}
          >
            <Mail className="mr-2 h-6 w-6" />
            이메일 로그인
          </Button>
        </div>

        {/* 하단 링크 */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <a href="#" className="hover:underline">
            계정 찾기
          </a>
          <Separator orientation="vertical" className="h-4" />
          <Link href="/signup" className="hover:underline">
            회원가입
          </Link>
        </div>

        {/* 도움말 */}
        <div className="text-sm text-gray-400">
          로그인에 어려움이 있나요?{' '}
          <a href="#" className="font-semibold hover:underline">
            도움말
          </a>
        </div>
        {/* <ProgressStepForm /> */}
      </div>
    </form>
  );
}
