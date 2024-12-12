"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import MainBanner from "./_components/banner/main-banner";

export default function EmploymentForm() {
  const [selectedValue, setSelectedValue] = useState("company");
  return (
    <div className="max-w-[1024px] mx-auto">
      <MainBanner />

      <div className="space-y-8">
        {/* 계정 유형 선택 */}
        <RadioGroup
          defaultValue="company"
          className="grid grid-cols-2 gap-4"
          onValueChange={(value) => setSelectedValue(value)}
        >
          <Label htmlFor="company" className="cursor-pointer">
            <Card
              className={`relative p-4 cursor-pointer transition-all ${
                selectedValue === "company"
                  ? "border-2 border-blue-500"
                  : "border border-gray-200"
              }`}
            >
              <RadioGroupItem
                value="company"
                id="company"
                className="absolute right-4 top-4"
              />
              <div className="mb-2 font-medium">1 vs 1</div>
              <div className="text-sm text-gray-600">
                기업 인사 담당자로 자사 채용을 담당하는 개인 또는 팀
              </div>
            </Card>
          </Label>

          <Label htmlFor="headhunter" className="cursor-pointer">
            <Card
              className={`relative p-4 cursor-pointer transition-all ${
                selectedValue === "headhunter"
                  ? "border-2 border-blue-500"
                  : "border border-gray-200"
              }`}
            >
              <RadioGroupItem
                value="headhunter"
                id="headhunter"
                className="absolute right-4 top-4"
              />
              <div className="mb-2 font-medium">2 vs 2</div>
              <div className="text-sm text-gray-600">
                리크루팅 에이전시로서 기업의 의뢰를 받아 후보자를 연결하는 분
              </div>
            </Card>
          </Label>
        </RadioGroup>

        {/* 기업 정보 섹션 */}
        <Card className="p-4">
          <h3 className="text-xl font-bold mb-6">기업 정보</h3>

          <div className="space-y-6">
            {/* 회사 이메일 */}
            <div>
              <Label htmlFor="email" className="font-medium">
                회사 이메일 주소<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                placeholder="회사의 이메일 주소를 입력"
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                ※ 회사 도메인이 포함된 메일주소로 인증을 진행해 주세요.
              </p>
            </div>

            {/* 회사명 */}
            <div>
              <Label htmlFor="company-name" className="font-medium">
                회사명<span className="text-red-500">*</span>
              </Label>
              <Input
                id="company-name"
                placeholder="회사명 입력"
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                ※ 작성한 회사명으로 등록한 함께 후보자를 관리할 수 있는 기업
                조직이 생성됩니다
              </p>
            </div>

            {/* 사업자 등록 번호 */}
            <div>
              <Label htmlFor="business-number" className="font-medium">
                사업자 등록 번호<span className="text-red-500">*</span>
              </Label>
              <Input
                id="business-number"
                placeholder="000 - 00 - 00000"
                className="mt-2"
              />
              <p className="text-sm text-red-500 mt-1">
                사업자 등록 번호를 입력해주세요
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ※ 자동 입력된 회사명과 사업자 등록번호가 채직중인 회사의 것과
                다른 경우에는 수정해 주세요. (예시. 개인메일로 인증한 경우)
              </p>
            </div>

            {/* 담당자 정보 섹션 */}
            <div>
              <h3 className="text-xl font-bold mb-4">담당자 정보</h3>
              <div>
                <Label htmlFor="name" className="font-medium">
                  이름<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="이름을 입력해주세요"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
