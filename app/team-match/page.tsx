"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
      description: "팀전",
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
      description: "흰공, 노란공, 빨간공으로 이루어진 게임",
    },
    {
      id: "pocketball",
      value: "pocketball",
      title: "포켓볼",
      description: "총 15개로 본인의 공을 먼저 넣는 게임",
    },
  ];

  return (
    <div className="max-w-[1024px] mx-auto">
      <MainBanner />

      <div className="space-y-8">
        {/* 매치 유형 */}
        {/* <p className="p-2">희망지역 선택</p>
        <LocationSelector /> */}

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
                연락받을 휴대폰 번호<span className="text-red-500">*</span>
              </Label>
              <Input id="email" placeholder="010-0000-0000" className="mt-2" />
            </div>

            {/* 회사명 */}
            <div>
              <Label htmlFor="company-name" className="font-medium">
                본인 다마<span className="text-red-500">*</span>
              </Label>
              <Input
                id="company-name"
                placeholder="본인의 다마를 적어주세요."
                className="mt-2"
              />
            </div>

            {/* 사업자 등록 번호 */}
            <div>
              <Label htmlFor="business-number" className="font-medium">
                개인정보 활용동의<span className="text-red-500">*</span>
              </Label>
              &nbsp;
              <Checkbox id="business-checkbox" className="mt-2" />
              <p className="text-sm text-gray-500 mt-1">
                ※ 현재 지역 기준으로 매칭지역에 등록됩니다.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4 justify-center mt-6 mb-4">
        <Button className="w-full h-12 px-4 py-2 text-md">선수보기</Button>
        <Button className="w-full h-12 px-4 py-2 text-md">등록하기</Button>
      </div>
    </div>
  );
}
