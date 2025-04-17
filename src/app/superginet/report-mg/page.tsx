import React, { Suspense } from 'react';
import ReportsForm from './form';

export default function ReportPage() {
  return (
    <Suspense fallback={<div>...</div>}>
      <ReportsForm />
    </Suspense>
  );
}
