import React, { ReactNode } from 'react';
import ClubTab from './_components/tab/club-tab';
import ClubHeader from './_components/header/club-header';

interface ClubLayoutProps {
  children: ReactNode;
}

export default function ClubLayout({ children }: ClubLayoutProps) {
  return (
    <>
      <ClubHeader />
      <ClubTab />
      {children}
    </>
  );
}
