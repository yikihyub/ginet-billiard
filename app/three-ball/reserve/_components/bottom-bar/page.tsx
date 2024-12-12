import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ArrowUp } from "lucide-react";

export default function BottomBar() {
  return (
    <>
      <div className="fixed top-4 z-50">
        <Sheet>
          <SheetTrigger className="fixed bottom-0 w-full bg-white rounded-t-xl shadow-lg p-4">
            <div className="flex flex-col items-center">
              <ArrowUp className="text-gray-400 mb-2 h-5 w-5" />
              <span className="text-sm text-gray-600">
                100개의 스크린골프 매장 목록보기
              </span>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[100vh]">
            <SheetHeader>
              <SheetTitle>근처 당구장 목록보기</SheetTitle>
              <SheetDescription>근처 당구장을 찾아보세요</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
