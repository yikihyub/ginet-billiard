'use client';

import { Suspense } from 'react';
import MatchResult from './_components/match-result';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function MatchResultPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MatchResult />
    </Suspense>
  );
}
