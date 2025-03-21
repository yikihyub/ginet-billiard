'use client';

import React, { Suspense } from 'react';

import TabList from './_components/tab/tab-list';
import MainBanner from './_components/banner/main-banner';

import { Toaster } from '@/components/ui/mtoaster';
import Tab from './_components/tab/tab';

export default function MobilePage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <div>
        <Tab />
        <MainBanner />
      </div>
      <div className="bg-white">
        <TabList />
        <Toaster />
      </div>
    </Suspense>
  );
}
