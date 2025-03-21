import React from 'react';

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="m-auto h-screen max-w-5xl p-4">{children}</div>;
}
