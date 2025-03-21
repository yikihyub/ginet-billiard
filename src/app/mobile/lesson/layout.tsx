import React, { ReactNode } from 'react';

interface LessonLayoutProps {
  children: ReactNode;
}

export default function LessonLayout({ children }: LessonLayoutProps) {
  return <div>{children}</div>;
}
