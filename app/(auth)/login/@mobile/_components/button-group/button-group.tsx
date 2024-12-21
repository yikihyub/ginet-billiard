"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Apple, MessageSquare, Rss } from "lucide-react";

export default function ButtonGroup() {
  const router = useRouter();
  const handleEmailLogin = () => {
    router.push("/login/form"); // 또는 /auth/login/form 등 원하는 경로
  };
  return (
    <>
      <div className="flex w-full flex-col px-4 absolute z-10 bottom-10">
        <h2 className="text-xl font-bold text-center">
          로그인 방법을 선택하세요
        </h2>

        {/* 로그인 버튼 그룹 */}
        <div className="w-full space-y-3 p-4">
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
            onClick={handleEmailLogin}
          >
            <Mail className="mr-2 h-6 w-6" />
            이메일 로그인
          </Button>
        </div>
      </div>
    </>
  );
}
