import React from 'react';

import UserManagementContainer from '../../_components/users/user-management-container';

const UsersPage: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">회원 관리</h1>
        <div className="mt-1 text-sm text-gray-500">홈 &gt; 회원 관리</div>
      </div>

      <UserManagementContainer />
    </>
  );
};

export default UsersPage;
