import React from 'react';

import BlockedUsersContainer from '../../_components/users/user-blocked-container';

export const metadata = {
  title: '차단된 회원 관리 - 당구장 관리자',
  description: '당구장 관리자 시스템 - 차단된 회원 관리 페이지',
};

export default function BlockedUsersPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">차단된 회원 관리</h1>
        <div className="mt-1 text-sm text-gray-500">
          홈 &gt; 회원 관리 &gt; 차단된 회원
        </div>
      </div>

      <BlockedUsersContainer />
    </>
  );
}
