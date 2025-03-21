import React from 'react';

export default function AlertRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <>{children}</>
    </div>
  );
}
