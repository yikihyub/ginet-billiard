'use client';

import React from 'react';
import UserCard from '../card/user-card';
import { useUserContext } from '../context/match-context';

export default function UserList() {
  const { users, loading } = useUserContext();

  if (loading) {
    return (
      <div className="py-4 text-center">회원정보 목록을 불러오는 중입니다.</div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        주변에 등록된 상대가 없습니다
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ul>
  );
}
