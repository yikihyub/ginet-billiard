import React from 'react';

import EvaHeader from './_components/header/header';
import MainForm from './_components/form/main-form';
import { EvaluationProvider } from './_components/context/evalueate-context';

export default function MatchEvaluatePage() {
  return (
    <EvaluationProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <EvaHeader />
        <MainForm />
      </div>
    </EvaluationProvider>
  );
}
