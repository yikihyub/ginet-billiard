'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import {
  ChevronRight,
  BarChart3,
  Settings,
  Bell,
  CreditCard,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const MenuToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative z-50">
      {/* Mobile */}
      {isMobile && (
        <>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
            className="flex h-6 w-6 items-center"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-full p-0 sm:max-w-md">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <div className="h-full overflow-y-auto">
                {/* 헤더 */}
                <div className="flex items-center bg-white p-4">
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
                <div className="grid grid-cols-2 gap-4 pb-2 pl-4 pr-4 pt-2">
                  <button className="border-#f8f9fa rounded-xl border p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">3구 다마</div>
                        <div className="text-md mt-1 text-left font-bold">
                          20
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                  <button className="border-#f8f9fa rounded-xl border p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-gray-500">4구 다마</div>
                        <div className="text-md mt-1 text-left font-bold">
                          400
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                </div>

                {/* 수업 코스 */}
                <div className="pb-2 pl-4 pr-4 pt-2">
                  <div className="border-#f8f9fa rounded-xl border bg-white p-4">
                    <div className="text-sm text-gray-500">나의 수업코스는</div>
                    <div className="mt-1 text-xl font-bold">
                      외모 및 성격 묘사하기
                    </div>
                    <div className="mt-2 text-gray-400">코스 변경하기</div>
                  </div>
                </div>

                {/* 수업 기간 & 출석률 */}
                <div className="p-4">
                  <div className="rounded-xl bg-white p-4">
                    <div>
                      <div className="text-sm text-gray-500">수업 기간</div>
                      <div className="mt-1 text-lg font-medium">
                        2024.10.16 ~ 2024.10.18
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">수업 출석률</div>
                      <div className="mt-2 flex items-center justify-between">
                        <Progress value={0} className="h-2" />
                        <span className="ml-2">0/0(0%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 메뉴 리스트 */}
                <div className="space-y-2 p-4">
                  <button className="flex w-full items-center justify-between rounded-xl bg-white p-4">
                    <div className="flex items-center">
                      <BarChart3 className="mr-3 h-5 w-5" />
                      <span>레벨테스트 내역</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="flex w-full items-center justify-between rounded-xl bg-white p-4">
                    <div className="flex items-center">
                      <Settings className="mr-3 h-5 w-5" />
                      <span>계정 설정 관리</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="flex w-full items-center justify-between rounded-xl bg-white p-4">
                    <div className="flex items-center">
                      <Bell className="mr-3 h-5 w-5" />
                      <span>공지사항 / 이벤트</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="flex w-full items-center justify-between rounded-xl bg-white p-4">
                    <div className="flex items-center">
                      <CreditCard className="mr-3 h-5 w-5" />
                      <span>결제 / 구독 관리</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
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
