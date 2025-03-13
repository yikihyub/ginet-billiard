import React from 'react';

export default function RootLayout({
  mobile,
  desktop,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
}) {
  return (
    <div className="m-auto max-w-[1024px] p-4">
      {/* 모바일 */}
      <div className="md:hidden">{mobile}</div>

      {/* 데스크톱 */}
      <div className="hidden md:block">{desktop}</div>
    </div>
  );
}
