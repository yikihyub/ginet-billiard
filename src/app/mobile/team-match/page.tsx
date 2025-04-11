import React from 'react';

import MatchHeader from './_components/header/match-header';
import MatchRegisterForm from './_components/form/match-register-form';

import { MatchRegisterProvider } from './_components/context/match-register-context';

export default function MatchRegisterPage() {
  return (
    <MatchRegisterProvider>
      <MatchHeader />
      <MatchRegisterForm />
    </MatchRegisterProvider>
  );
}
