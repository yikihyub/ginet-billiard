"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

        {/* 아이디와 패스워드 입력 */}
        <form className="space-y-4">
          <Input type="text" placeholder="아이디" className="w-full" />
          <Input type="password" placeholder="패스워드" className="w-full" />
          <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
            로그인
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-1" />
          <span className="px-4 text-gray-500 text-sm">또는</span>
          <hr className="flex-1" />
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-4">
          <Button
            className="w-full bg-green-500 text-white hover:bg-green-600"
            onClick={() => signIn("naver")}
          >
            네이버로 로그인
          </Button>
          <Button
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
            onClick={() => signIn("kakao")}
          >
            카카오로 로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
