'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { User } from '../../_types/user';

interface BlockedUser extends User {
  ban_reason: string;
  ban_expires_at: string | null;
  ban_time_left?: string; // 남은 차단 시간 (계산된 값)
}

const BlockedUsersContainer: React.FC = () => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    banType: 'all', // 'all', 'temporary', 'permanent'
    expiringSoon: false,
  });

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  // 데이터 로드
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      setIsLoading(true);
      try {
        // API 호출 - 차단된 회원만 가져오는 API
        const response = await fetch('/api/users?status=banned&limit=100');
        if (!response.ok) {
          throw new Error('차단된 회원 목록을 불러오는데 실패했습니다');
        }

        const data = await response.json();

        // 차단 만료 시간 계산 및 남은 시간 추가
        const usersWithTimeLeft = data.users.map((user: BlockedUser) => {
          // 남은 차단 시간 계산
          let timeLeft = '';
          if (user.ban_expires_at) {
            const expireDate = new Date(user.ban_expires_at);
            const now = new Date();

            if (expireDate > now) {
              const diffMs = expireDate.getTime() - now.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              const diffHours = Math.floor(
                (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              );

              if (diffDays > 0) {
                timeLeft = `${diffDays}일 ${diffHours}시간`;
              } else {
                timeLeft = `${diffHours}시간`;
              }
            } else {
              timeLeft = '만료됨';
            }
          } else {
            timeLeft = '영구 차단';
          }

          return {
            ...user,
            ban_time_left: timeLeft,
          };
        });

        setBlockedUsers(usersWithTimeLeft);
        setFilteredUsers(usersWithTimeLeft);
        setTotalPages(Math.ceil(usersWithTimeLeft.length / usersPerPage));
      } catch (err) {
        console.error('차단된 회원 목록 조회 실패:', err);
        setError(
          err instanceof Error
            ? err.message
            : '차단된 회원 목록을 불러오는데 실패했습니다'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  // 필터링 적용
  useEffect(() => {
    let result = [...blockedUsers];

    // 검색어 필터링
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.ban_reason &&
            user.ban_reason.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 차단 유형 필터링
    if (filters.banType === 'temporary') {
      result = result.filter((user) => user.ban_expires_at !== null);
    } else if (filters.banType === 'permanent') {
      result = result.filter((user) => user.ban_expires_at === null);
    }

    // 곧 만료되는 차단만 보기
    if (filters.expiringSoon) {
      result = result.filter((user) => {
        if (!user.ban_expires_at) return false;

        const expireDate = new Date(user.ban_expires_at);
        const now = new Date();
        const diffMs = expireDate.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        return diffDays <= 3 && diffMs > 0; // 3일 이내에 만료되는 차단
      });
    }

    setFilteredUsers(result);
    setTotalPages(Math.ceil(result.length / usersPerPage));
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
  }, [searchTerm, filters, blockedUsers]);

  // 차단 해제 처리
  const handleUnban = async (userId: number) => {
    if (!confirm('이 사용자의 차단을 해제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/unban`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '차단 해제에 실패했습니다');
      }

      // 목록에서 해당 사용자 제거
      setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
      alert('차단이 해제되었습니다.');
    } catch (err) {
      console.error('차단 해제 실패:', err);
      alert(err instanceof Error ? err.message : '차단 해제에 실패했습니다');
    }
  };

  // 현재 페이지 사용자 계산
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500">차단된 회원 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        role="alert"
      >
        <p className="font-bold">오류 발생</p>
        <p>{error}</p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <AlertTriangle size={32} className="mx-auto mb-4 text-yellow-500" />
        <p className="text-gray-500">
          {blockedUsers.length === 0
            ? '차단된 회원이 없습니다.'
            : '검색 조건에 맞는 차단된 회원이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 검색 및 필터 영역 */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          {/* 검색 */}
          <div className="relative mb-4 md:mb-0 md:w-1/3">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="이름, 이메일, 차단 사유 검색..."
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
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* 차단 유형 필터 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                차단 유형
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={filters.banType}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, banType: e.target.value }))
                }
              >
                <option value="all">모든 차단</option>
                <option value="temporary">임시 차단</option>
                <option value="permanent">영구 차단</option>
              </select>
            </div>

            {/* 곧 만료되는 차단 필터 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="expiringSoon"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.expiringSoon}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    expiringSoon: e.target.checked,
                  }))
                }
              />
              <label
                htmlFor="expiringSoon"
                className="ml-2 text-sm text-gray-700"
              >
                곧 만료되는 차단만 보기 (3일 이내)
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 차단된 회원 목록 */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  회원정보
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  차단 사유
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  차단 기간
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  남은 시간
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.profile_image ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.profile_image}
                            alt=""
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                            <span className="text-gray-500">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-sm text-gray-900">
                      {user.ban_reason || '사유 없음'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user.ban_expires_at ? (
                      <div className="text-sm text-gray-500">
                        {new Date(user.ban_expires_at).toLocaleDateString(
                          'ko-KR'
                        )}{' '}
                        까지
                      </div>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                        영구 차단
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1 text-gray-400" />
                      <span
                        className={`text-sm ${
                          user.ban_time_left === '영구 차단'
                            ? 'font-semibold text-red-600'
                            : user.ban_time_left === '만료됨'
                              ? 'text-green-600'
                              : 'text-gray-500'
                        }`}
                      >
                        {user.ban_time_left}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleUnban(user.id)}
                      className="flex items-center justify-end text-green-600 hover:text-green-900"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      차단 해제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                전체 <span className="font-medium">{filteredUsers.length}</span>
                명 중{' '}
                <span className="font-medium">
                  {(currentPage - 1) * usersPerPage + 1}
                </span>
                -
                <span className="font-medium">
                  {Math.min(currentPage * usersPerPage, filteredUsers.length)}
                </span>
                명을 보여주고 있습니다
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  이전
                </button>

                {/* 페이지 버튼 생성 */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // 총 페이지가 5개 이상일 경우 현재 페이지 주변 페이지만 표시
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center border px-4 py-2 ${
                        currentPage === pageNum
                          ? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  다음
                </button>
              </nav>
            </div>
          </div>
          {/* 모바일 페이지네이션 */}
          <div className="flex w-full items-center justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                currentPage === 1
                  ? 'cursor-not-allowed text-gray-300'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              이전
            </button>
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                currentPage === totalPages
                  ? 'cursor-not-allowed text-gray-300'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockedUsersContainer;
