import React, { Suspense } from 'react';
import Image from 'next/image';

import CommunityContainer from '../_components/container/community-container';

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div>
          <Image width={150} height={80} src="/logo/logo_banner_b.png" alt="" />
        </div>
      }
    >
      <CommunityContainer />
    </Suspense>
  );
}
