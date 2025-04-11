import React, { ReactNode } from 'react';

interface MatchEvaluateLayoutProps {
  children: ReactNode;
}

export default function MatchEvaluateLayout({
  children,
}: MatchEvaluateLayoutProps) {
  return <div>{children}</div>;
}
