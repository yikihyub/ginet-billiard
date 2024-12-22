"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  ChevronRight,
  BarChart3,
  Settings,
  Bell,
  CreditCard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const MenuToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative z-50">
      {/* Mobile */}
      {isMobile && (
        <>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
            className="flex items-center w-6 h-6"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <div className="h-full overflow-y-auto">
                {/* 헤더 */}
                <div className="flex items-center p-4 bg-white">
                  <div className="text-2xl font-bold">Profile</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>당큐</AvatarFallback>
                    </Avatar>
                    <span className="text-lg font-semibold">큐선생님</span>
                  </div>
                </div>

                {/* 레벨 & 수업스타일 */}
                <div className="grid grid-cols-2 gap-4 pl-4 pr-4 pb-2 pt-2">
                  <button className="p-4 rounded-xl border border-#f8f9fa">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">3구 다마</div>
                        <div className="text-md font-bold mt-1 text-left">
                          20
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                  <button className="p-4 rounded-xl border border-#f8f9fa">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">4구 다마</div>
                        <div className="text-md font-bold mt-1 text-left">
                          400
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </div>

                {/* 수업 코스 */}
                <div className="pr-4 pl-4 pb-2 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-#f8f9fa">
                    <div className="text-sm text-gray-500">나의 수업코스는</div>
                    <div className="text-xl font-bold mt-1">
                      외모 및 성격 묘사하기
                    </div>
                    <div className="text-gray-400 mt-2">코스 변경하기</div>
                  </div>
                </div>

                {/* 수업 기간 & 출석률 */}
                <div className="p-4">
                  <div className="p-4 bg-white rounded-xl">
                    <div>
                      <div className="text-sm text-gray-500">수업 기간</div>
                      <div className="text-lg font-medium mt-1">
                        2024.10.16 ~ 2024.10.18
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">수업 출석률</div>
                      <div className="flex items-center justify-between mt-2">
                        <Progress value={0} className="h-2" />
                        <span className="ml-2">0/0(0%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 메뉴 리스트 */}
                <div className="p-4 space-y-2">
                  <button className="flex items-center justify-between w-full p-4 bg-white rounded-xl">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-3" />
                      <span>레벨테스트 내역</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="flex items-center justify-between w-full p-4 bg-white rounded-xl">
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-3" />
                      <span>계정 설정 관리</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="flex items-center justify-between w-full p-4 bg-white rounded-xl">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 mr-3" />
                      <span>공지사항 / 이벤트</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="flex items-center justify-between w-full p-4 bg-white rounded-xl">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-3" />
                      <span>결제 / 구독 관리</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
};

export default MenuToggle;
