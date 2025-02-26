import React from 'react';

import TabList from './_components/tab/tab-list';
import MainBanner from './_components/banner/main-banner';

import { Toaster } from '@/components/ui/mtoaster';

export default function MobilePage() {
  return (
    <>
      <MainBanner />
      <TabList />
      <Toaster />
    </>
  );
}
