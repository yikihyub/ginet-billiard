import React from 'react';

import MainBanner from '../_components/banner/main-banner';
import MainContainer from './_components/container/main-container';

export default function MemberSearchPage() {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white px-4">
        <MainBanner />
      </div>

      <div className="bg-white p-4">
        <MainContainer />
      </div>
    </div>
  );
}
