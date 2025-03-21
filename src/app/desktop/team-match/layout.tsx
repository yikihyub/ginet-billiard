import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto max-w-[1024px] p-4">
      <>{children}</>
    </div>
  );
}
