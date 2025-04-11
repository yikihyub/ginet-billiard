'use client';

import React from 'react';
import UserStatsCard from './user-stats-card';
import UserSearchFilter from './user-search-filter';
import UserTable from './user-table';
import UserBanModal from './user-ban-modal';
import UserDetailModal from './user-detail-modal';

import { useUserManagement } from '../../_hooks/useUserManagement';

const UserManagementContainer: React.FC = () => {
  // 사용자 관리 훅 사용
  const {
    filteredUsers,
    isLoading,
    currentPage,
    usersPerPage,
    totalPages,
    searchTerm,
    filters,
    sortField,
    sortDirection,
    selectedUser,
    showBanModal,
    userToBan,
    setSearchTerm,
    setFilters,
    setSortField,
    setSortDirection,
    setCurrentPage,
    setSelectedUser,
    setShowBanModal,
    setUserToBan,
    handleUnbanUser,
    confirmBanUser,
  } = useUserManagement();

  // 현재 페이지의 사용자 목록 계산
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      {/* 회원 통계 */}
      <UserStatsCard
        isLoading={false}
        onViewAll={(category) => {
          // 각 카테고리별 페이지 이동 로직
          switch (category) {
            case 'all':
              // 전체 회원 목록 페이지
              break;
            case 'new':
              // 신규 회원 목록 페이지
              break;
            case 'banned':
              // 차단 회원 목록 페이지
              break;
            case 'reported':
              // 신고된 회원 목록 페이지
              break;
          }
        }}
        totalUsers={0}
        newUsers={0}
        bannedUsers={0}
        reportedUsers={0}
      />

      {/* 검색 및 필터 영역 */}
      <UserSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
      />

      {/* 사용자 목록 테이블 */}
      <UserTable
        users={currentUsers}
        isLoading={isLoading}
        filteredUsers={filteredUsers}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        usersPerPage={usersPerPage}
        indexOfFirstUser={indexOfFirstUser}
        indexOfLastUser={indexOfLastUser}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={(field) => {
          if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
          } else {
            setSortField(field);
            setSortDirection('asc');
          }
        }}
        onViewDetails={setSelectedUser}
        onBanUser={(user) => {
          setUserToBan(user);
          setShowBanModal(true);
        }}
        onUnbanUser={handleUnbanUser}
      />

      {/* 상세 정보 모달 */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onBanUser={() => {
            setUserToBan(selectedUser);
            setShowBanModal(true);
            setSelectedUser(null);
          }}
          onUnbanUser={() => {
            handleUnbanUser(selectedUser.id);
            setSelectedUser(null);
          }}
        />
      )}

      {/* 사용자 차단 모달 */}
      {showBanModal && userToBan && (
        <UserBanModal
          userId={userToBan.id}
          userName={userToBan.name}
          isOpen={showBanModal}
          onClose={() => setShowBanModal(false)}
          onConfirm={confirmBanUser}
        />
      )}
    </>
  );
};

export default UserManagementContainer;
