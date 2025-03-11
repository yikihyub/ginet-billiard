import React from 'react';

import MainContent from './_components/content/main-content';
import { ClubRegisterProvider } from '../_components/context/club-register-context';
import { FooterButtons } from './_components/footer/club-footer';

export default function ClubRegisterDesktopPage() {
  return (
    <ClubRegisterProvider>
      <MainContent />
      <FooterButtons />
    </ClubRegisterProvider>
  );
}
