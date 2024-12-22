"use client";

import React from "react";
export default function RootLayout({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  return (
    <>
      {/* 모바일 사이드바 */}
      <div className="md:hidden w-full">{mobile}</div>
      {/* 데스크톱 사이드바 */}
      <div className="hidden md:block">{desktop}</div>
    </>
  );
}
