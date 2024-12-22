"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [isPersonal, setIsPersonal] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      router.push(from);
    } catch (error) {
      setError("로그인 처리 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-4">
      {/* 로고 */}
      <div className="flex justify-center mb-12 mt-16">
        <div className="relative">
          <Image src="/logo/logo.png" alt="로고" width={160} height={100} />
        </div>
      </div>

      {/* 회원 유형 선택 */}
      <div className="flex justify-center mb-8">
        <div className="flex-1 text-center">
          <button
            className={cn(
              "pb-2",
              isPersonal
                ? "text-green-600 border-b-2 border-green-600 font-bold text-lg"
                : "text-gray-400"
            )}
            onClick={() => setIsPersonal(true)}
          >
            일반
          </button>
        </div>
        <div className="flex-1 text-center">
          <button
            className={cn(
              "pb-2",
              !isPersonal
                ? "text-green-600 border-b-2 border-green-600 font-bold text-lg"
                : "text-gray-400"
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
            type="email"
            placeholder="아이디 혹은 이메일"
            className="w-full p-4 border rounded-lg bg-white"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-4 border rounded-lg bg-white"
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
            className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-lg mt-4 text-lg font-semibold"
          >
            시작하기
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
      {/* 하단 링크들 */}
      <div className="flex justify-center space-x-4 mt-6 text-sm text-gray-500">
        <button>아이디 찾기</button>
        <span className="text-gray-300">|</span>
        <button>비밀번호 찾기</button>
        <span className="text-gray-300">|</span>
        <button onClick={() => router.push("/signup")}>회원가입</button>
      </div>

      {/* 소셜 로그인 섹션 */}
      <div className="mt-6">
        <div className="relative flex items-center text-center mb-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-sm text-gray-500">
            소셜 아이디로 간편 로그인
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          {/* 카카오 */}
          <div className="w-12 h-12 rounded-full bg-[#FAE100] flex items-center justify-center">
            <MessageCircle fill="#211C20" />
          </div>

          {/* 네이버 */}
          <div className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
        </div>
      </div>
    </div>
  );
}
