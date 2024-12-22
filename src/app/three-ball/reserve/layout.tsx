"use client";

import React from "react";
import { LocationProvider } from "./LocationContext";
import KakaoMap from "@/app/three-ball/reserve/_components/kakaomap/kakaomap";

export default function RootLayout({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  return (
    <LocationProvider>
      <article className="flex w-full h-screen">
        {/* 모바일 사이드바 */}
        <div className="md:hidden">{mobile}</div>

        {/* 데스크톱 사이드바 */}
        <div className="hidden md:block">{desktop}</div>
        <div className="md:w-full md:ml-0">
          <KakaoMap />
        </div>
      </article>
    </LocationProvider>
  );
}
