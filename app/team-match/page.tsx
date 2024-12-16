"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

import OptionCard from "./_components/optioncard/option-card";
import MainBanner from "./_components/banner/main-banner";
import { Button } from "@/components/ui/button";
import LocationSelector from "./_components/sidogun/sidogun";

export default function EmploymentForm() {
  const [accountSelectedValue, setAccountSelectedValue] = useState("company");
  const [gameSelectedValue, setGameSelectedValue] = useState("fourball");

  const accountOptions = [
    {
      id: "company",
      value: "company",
      title: "1 vs 1",
      description: "개인전",
    },
    {
      id: "headhunter",
      value: "headhunter",
      title: "2 vs 2",
      description:
        "팀전",
    },
  ];

  const gameOptions = [
    {
      id: "fourball",
      value: "fourball",
      title: "4구",
      description: "흰공, 노란공, 빨간공 2개로 이루어진 게임",
    },
    {
      id: "threeball",
      value: "threeball",
      title: "3구",
      description:
        "흰공, 노란공, 빨간공으로 이루어진 게임",
    },
    {
      id: "pocketball",
      value: "pocketball",
      title: "포켓볼",
      description:
        "총 15개로 본인의 공을 먼저 넣는 게임",
    },
  ];

  return (
    <div className="max-w-[1024px] mx-auto">
      <MainBanner />

      <div className="space-y-8">
        {/* 매치 유형 */}
        <p className="p-2">희망지역 선택</p>
        <LocationSelector />

        {/* 매치 유형 */}
        <p className="p-2">인원수 선택</p>
        <RadioGroup
          defaultValue="company"
          className="grid grid-cols-2 gap-4 !mt-2"
          onValueChange={(value) => setAccountSelectedValue(value)}
        >
          {accountOptions.map((option) => (
            <OptionCard
              key={option.id}
              {...option}
              selectedValue={accountSelectedValue}
              onValueChange={setAccountSelectedValue}
            />
          ))}
        </RadioGroup>

        {/* 게임 종류 타입 */}
        <p className="p-2 mt-2">게임종류 선택</p>
        <RadioGroup
          defaultValue="fourball"
          className="grid grid-cols-3 gap-4 !mt-2"
          onValueChange={(value) => setGameSelectedValue(value)}
        >
          {gameOptions.map((option) => (
            <OptionCard
              key={option.id}
              {...option}
              selectedValue={gameSelectedValue}
              onValueChange={setGameSelectedValue}
            />
          ))}
        </RadioGroup>

        {/* 개인정보 */}
        <p className="p-2 mt-2">개인정보</p>
        <Card className="p-4 !mt-2">
          <div className="space-y-6">
            {/* 신청자 이름 */}
            <div>
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
          </div>
        </Card>
      </div>

      <Button>등록하기</Button>
    </div>
  );
}
