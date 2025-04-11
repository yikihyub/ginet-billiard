import React from 'react';
import FilterSection from '../filter/filter-section';
import UserList from '../list/user-list';

export default function MainContainer() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">회원</div>
        <FilterSection />
      </div>

      <UserList />
    </>
  );
}
