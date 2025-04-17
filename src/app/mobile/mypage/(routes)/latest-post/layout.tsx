import React, { ReactNode, Suspense } from 'react';
import PostTab from '../../_components/tab/post-tab';
import LatestHeader from '../../_components/header/latest-header';

interface LatestPostLayoutProps {
  children: ReactNode;
}

export default function LatestPostLayoutPage({
  children,
}: LatestPostLayoutProps) {
  return (
    <Suspense fallback={<div>...</div>}>
      <LatestHeader />
      <PostTab />
      {children}
    </Suspense>
  );
}
