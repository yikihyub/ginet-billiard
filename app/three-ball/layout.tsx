import React, { ReactNode } from "react";
import ThreeballTab from "./_components/tab/threeball-tab";

interface layoutProps {
  children: ReactNode;
}

export default function ThreeBaalLayout({ children }: layoutProps) {
  return (
    <>
      <ThreeballTab />
      {children}
    </>
  );
}
