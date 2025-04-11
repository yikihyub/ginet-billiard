import React, { Suspense } from 'react';
import MatchRequest from './_components/request-form';

export default function MatchRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MatchRequest />
    </Suspense>
  );
}
