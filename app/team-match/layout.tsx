import Navigation from "@/components/(main)/main-nav";
import React, { ReactNode } from "react";

interface TeamMatchLayoutProps {
  children: ReactNode;
}

export default function TeamMatchLayout({ children }: TeamMatchLayoutProps) {
  return (
    <div className="m-auto max-w-[1024px] h-[100vh]">
      <Navigation />
      {children}
    </div>
  );
}
