import React, { ReactNode } from "react";
import ClubTab from "./_components/tab/club-tab";

interface ClubLayoutProps {
  children: ReactNode;
}

export default function ClubLayout({ children }: ClubLayoutProps) {
  return (
    <div className="max-w-[1024px] m-auto">
      <ClubTab />
      {children}
    </div>
  );
}
