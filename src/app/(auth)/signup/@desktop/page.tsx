"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Mail, Apple, MessageSquare, Rss } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-center h-screen px-4 space-y-6">
        <div>
          <Image src="/login/login_bak.jpg" alt="login_image" width={667} height={1000}
          />
        </div>
        {/* 이메일 로그인 폼 */}
        <div className="w-full max-w-sm space-y-4">
          <input
            name="email"
            type="email"
            placeholder="이메일"
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            className="w-full p-3 border rounded-lg"
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
        <h1 className="text-2xl font-bold text-center">
          로그인 방법을 선택하세요
        </h1>

        {/* 로그인 버튼 그룹 */}
        <div className="w-full max-w-sm space-y-3">
          {/* 카카오로 계속하기 */}
          <Button
            className={cn(
              "w-full bg-[#FAE104] text-black hover:bg-yellow-500",
              "rounded-lg text-md py-6 font-semibold",
              "h-12"
            )}
          >
            <MessageSquare className="mr-2 h-6 w-6" />{" "}
            {/* 아이콘 크기 키우기 */}
            카카오 로그인
          </Button>

          {/* 네이버로 계속하기 */}
          <Button
            className={cn(
              "w-full bg-[#02C75C] border text-black hover:bg-gray-100 shadow-none",
              "rounded-lg text-md py-6 font-semibold",
              "h-12"
            )}
          >
            <span className="text-green-600 font-bold mr-2">N</span>
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
              "w-full bg-white border text-black hover:bg-gray-100 shadow-none",
              "rounded-lg text-md font-semibold py-6",
              "h-12"
            )}
          >
            <Mail className="mr-2 h-6 w-6" />
            이메일 로그인
          </Button>
        </div>

        {/* 하단 링크 */}
        <div className="flex justify-center items-center text-gray-500 text-sm space-x-6">
          <a href="#" className="hover:underline">
            계정 찾기
          </a>
          <Separator orientation="vertical" className="h-4" />
          <a href="#" className="hover:underline">
            회원가입
          </a>
        </div>

        {/* 도움말 */}
        <div className="text-gray-400 text-sm">
          로그인에 어려움이 있나요?{" "}
          <a href="#" className="font-semibold hover:underline">
            도움말
          </a>
        </div>
        {/* <ProgressStepForm /> */}
      </div>
    </form>
  );
}
