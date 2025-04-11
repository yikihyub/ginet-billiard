import React from 'react';

import ProfileHeader from './_components/header/profile-header';
import ProfileContainer from './_components/container/profile-container';
import MainContainer from './_components/container/main-container';

export default function MemberProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* 상단 헤더 */}
      <ProfileHeader />

      {/* 프로필 정보 */}
      <ProfileContainer />

      {/* 탭 메뉴 */}
      <MainContainer />

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <button className="w-full rounded-md bg-green-600 py-4 text-lg font-bold text-white">
          경기 신청하기
        </button>
      </div>
    </div>
  );
}
