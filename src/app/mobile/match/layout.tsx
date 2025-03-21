import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex max-w-[1024px] flex-col gap-2 bg-gray-50">
      <>{children}</>
    </div>
  );
}
