'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { User, UserTableProps } from '../../_types/user';

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  filteredUsers,
  currentPage,
  setCurrentPage,
  totalPages,
  indexOfFirstUser,
  indexOfLastUser,
  sortField,
  sortDirection,
  handleSort,
  onViewDetails,
  onBanUser,
  onUnbanUser,
}) => {
  // 사용자 레벨에 따른 배지 렌더링
  const renderLevelBadge = (level: User['bi_level']) => {
    switch (level) {
      case 'ADMIN':
        return (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
            관리자
          </span>
        );
      case 'MANAGER':
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
            매니저
          </span>
        );
      case 'RESTRICTED':
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
            제한됨
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
            일반회원
          </span>
        );
    }
  };

  // 게임 타입에 따른 표시
  const getGameTypeDisplay = (gameType: User['preferGame']) => {
    switch (gameType) {
      case 'FOUR_BALL':
        return '사구';
      case 'THREE_BALL':
        return '삼구';
      case 'POCKET_BALL':
        return '포켓볼';
      default:
        return gameType;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500">회원 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <button
                  className="flex items-center"
                  onClick={() => handleSort('id')}
                >
                  ID
                  {sortField === 'id' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <button
                  className="flex items-center"
                  onClick={() => handleSort('name')}
                >
                  회원정보
                  {sortField === 'name' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <button
                  className="flex items-center"
                  onClick={() => handleSort('preferGame')}
                >
                  선호게임
                  {sortField === 'preferGame' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <button
                  className="flex items-center"
                  onClick={() => handleSort('createdAt')}
                >
                  가입일
                  {sortField === 'createdAt' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <button
                  className="flex items-center"
                  onClick={() => handleSort('trust_score')}
                >
                  신뢰도
                  {sortField === 'trust_score' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                상태
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
            {users.map((user) => (
              <tr
                key={user.id}
                className={user.is_banned ? 'bg-red-50' : 'hover:bg-gray-50'}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.id}
                </td>
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
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="ml-2">
                          {renderLevelBadge(user.bi_level)}
                        </div>
                        {user.warning_count > 0 && (
                          <div className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
                            경고 {user.warning_count}회
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.provider && (
                        <div className="mt-1 text-xs text-gray-400">
                          {user.provider === 'kakao' && '카카오로 로그인'}
                          {user.provider === 'google' && '구글로 로그인'}
                          {user.provider === 'naver' && '네이버로 로그인'}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {getGameTypeDisplay(user.preferGame)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="relative h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`absolute left-0 top-0 h-2 rounded-full ${
                        user.trust_score > 80
                          ? 'bg-green-500'
                          : user.trust_score > 60
                            ? 'bg-blue-500'
                            : user.trust_score > 40
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                      }`}
                      style={{ width: `${user.trust_score}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-center text-xs text-gray-500">
                    {Math.round(user.trust_score)}점
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {user.is_banned ? (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                      정지됨
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                      활성
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => onViewDetails(user)}
                    >
                      상세
                    </button>
                    {user.is_banned ? (
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => onUnbanUser(user.id)}
                      >
                        차단해제
                      </button>
                    ) : (
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => onBanUser(user)}
                      >
                        차단
                      </button>
                    )}
                  </div>
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
              전체 <span className="font-medium">{filteredUsers.length}</span>명
              중 <span className="font-medium">{indexOfFirstUser + 1}</span>-
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
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
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
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
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
              setCurrentPage(Math.min(currentPage + 1, totalPages))
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
  );
};

export default UserTable;
