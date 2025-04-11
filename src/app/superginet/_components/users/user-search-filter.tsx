'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { UserSearchFilterProps } from '../../_types/user';

const UserSearchFilter: React.FC<UserSearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // 필터 변경 핸들러
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* 검색 */}
        <div className="relative mb-4 md:mb-0 md:w-1/3">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="이름, 이메일, 전화번호 검색..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 필터 토글 버튼 */}
        <button
          className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-2" />
          필터 {showFilters ? '숨기기' : '표시'}
        </button>
      </div>

      {/* 확장된 필터 영역 */}
      {showFilters && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* 회원 레벨 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              회원 레벨
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              <option value="all">전체 레벨</option>
              <option value="ADMIN">관리자</option>
              <option value="MANAGER">매니저</option>
              <option value="MEMBER">일반회원</option>
              <option value="RESTRICTED">제한됨</option>
            </select>
          </div>

          {/* 계정 상태 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              계정 상태
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="active">활성 계정</option>
              <option value="banned">정지된 계정</option>
            </select>
          </div>

          {/* 선호 게임 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              선호 게임
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.game}
              onChange={(e) => handleFilterChange('game', e.target.value)}
            >
              <option value="all">전체 게임</option>
              <option value="FOUR_BALL">사구</option>
              <option value="THREE_BALL">삼구</option>
              <option value="POCKET_BALL">포켓볼</option>
            </select>
          </div>

          {/* 경고 횟수 필터 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              경고 횟수
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.warningCount}
              onChange={(e) =>
                handleFilterChange('warningCount', e.target.value)
              }
            >
              <option value="all">전체</option>
              <option value="warning">경고 있음</option>
              <option value="noWarning">경고 없음</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearchFilter;
