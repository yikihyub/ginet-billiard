import React, { ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

export default function ThreeBaalLayout({ children }: layoutProps) {
  return (
    <div className="max-w-[1024px] m-auto h-[100vh] pl-4 pr-4">{children}</div>
  );
}
