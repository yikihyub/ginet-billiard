import React, { Suspense } from 'react';
import ProfileTab from '../tab/profile-tab';

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProfileTab />
    </Suspense>
  );
}
