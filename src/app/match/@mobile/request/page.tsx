import React, { Suspense } from 'react';
import MatchRequest from './_components/request-form';

export default function MatchRequestPage() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <MatchRequest />
    </Suspense>
  );
}
