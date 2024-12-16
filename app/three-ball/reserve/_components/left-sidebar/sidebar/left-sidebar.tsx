"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  // SheetDescription,
} from "@/components/ui/sheet";
import { ArrowUp } from "lucide-react";
import { SearchBar } from "../search/search-bar";
import { BilliardRoomCard } from "../card/billiard-roomcard";

export default function LeftSideBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {isMobile ? (
        <div className="fixed top-4 z-50">
          <Sheet>
            <SheetTrigger className="fixed bottom-0 w-full bg-white rounded-t-xl shadow-lg p-4">
              <div className="flex flex-col items-center">
                <ArrowUp className="text-gray-400 mb-2 h-5 w-5" />
                <span className="text-sm text-gray-600">
                  근처 당구장 목록보기
                </span>
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[100%]">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <div>
                <div className="flex w-full flex-col h-full">
                  <SearchBar />
                </div>
                <div className="customHr"></div>
                <BilliardRoomCard />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <aside className="leftsidebar h-full md:w-[400px] w-full">
          <div className="flex w-full flex-col h-full">
            <SearchBar />
          </div>
          <div className="customHr"></div>
          <BilliardRoomCard />
        </aside>
      )}
    </>
  );
}
