"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
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
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
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
      </form>
    </>
  );
}
