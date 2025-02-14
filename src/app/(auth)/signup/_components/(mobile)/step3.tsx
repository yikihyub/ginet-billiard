"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export default function Step3() {
  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">
          평소 본인의 점수를
          <br />
          선택해주세요.
        </h2>

        <div className="space-y-4">
          {/* 4구 섹션 */}
          <div className="space-y-2">
            <label className="font-medium">4구</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600">평균 게임 시간</label>
                <Input
                  type="number"
                  placeholder="시간 입력"
                  className="w-full mt-1 h-14 border-0 bg-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">점수</label>
                <Select>
                  <SelectTrigger className="mt-1 h-14 border-0 bg-gray-100">
                    <SelectValue placeholder="점수 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="50">50점</SelectItem>
                      <SelectItem value="80">80점</SelectItem>
                      <SelectItem value="100">100점</SelectItem>
                      <SelectItem value="120">120점</SelectItem>
                      <SelectItem value="150">150점</SelectItem>
                      <SelectItem value="200">200점</SelectItem>
                      <SelectItem value="250">250점</SelectItem>
                      <SelectItem value="300">300점</SelectItem>
                      <SelectItem value="400">400점</SelectItem>
                      <SelectItem value="500">500점</SelectItem>
                      <SelectItem value="over500">500점 이상</SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 3구 섹션 */}
          <div className="space-y-2">
            <label className="font-medium">3구</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600">평균 게임 시간</label>
                <Input
                  type="number"
                  placeholder="시간 입력"
                  className="w-full mt-1 h-14 border-0 bg-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">점수</label>
                <Select>
                  <SelectTrigger className="mt-1 h-14 border-0 bg-gray-100">
                    <SelectValue placeholder="점수 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="10">10점</SelectItem>
                      <SelectItem value="11">11점</SelectItem>
                      <SelectItem value="13">13점</SelectItem>
                      <SelectItem value="14">14점</SelectItem>
                      <SelectItem value="15">15점</SelectItem>
                      <SelectItem value="16">16점</SelectItem>
                      <SelectItem value="18">18점</SelectItem>
                      <SelectItem value="19">19점</SelectItem>
                      <SelectItem value="20">20점</SelectItem>
                      <SelectItem value="21">21점</SelectItem>
                      <SelectItem value="23">23점</SelectItem>
                      <SelectItem value="24">24점</SelectItem>
                      <SelectItem value="25">25점</SelectItem>
                      <SelectItem value="26">26점</SelectItem>
                      <SelectItem value="28">28점</SelectItem>
                      <SelectItem value="29">29점</SelectItem>
                      <SelectItem value="30">30점</SelectItem>
                      <SelectItem value="31">31점</SelectItem>
                      <SelectItem value="31over">31점 이상</SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          선택 항목에 동의하지 않아도 서비스 이용이 가능합니다.
          <br />
          개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며
          <br />
          동의 거부 시 서비스 이용이 제한됩니다.
        </p>
      </div>
    </>
  );
}
