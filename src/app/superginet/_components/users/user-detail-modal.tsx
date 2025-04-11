'use client';

import React from 'react';
import { User, UserDetailModalProps } from '../../_types/user';

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  onClose,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-xl font-bold">{user.name} 회원 상세 정보</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 기본 정보 */}
            <div className="rounded-lg bg-gray-50 p-4 md:col-span-1">
              <div className="mb-4 flex items-center">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt=""
                    className="h-20 w-20 rounded-full"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl text-gray-600">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="mt-1">{renderLevelBadge(user.bi_level)}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">연락처</div>
                  <div className="text-sm">{user.phonenum || '미등록'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">가입일</div>
                  <div className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">마지막 로그인</div>
                  <div className="text-sm">
                    {new Date(user.loginAt).toLocaleString('ko-KR')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">가입 경로</div>
                  <div className="text-sm">
                    {user.provider
                      ? user.provider === 'kakao'
                        ? '카카오 로그인'
                        : user.provider === 'google'
                          ? '구글 로그인'
                          : user.provider === 'naver'
                            ? '네이버 로그인'
                            : user.provider
                      : '일반 가입'}
                  </div>
                </div>
              </div>
            </div>

            {/* 게임 정보 및 활동 내역 */}
            <div className="space-y-6 md:col-span-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-md mb-3 font-medium">게임 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">선호 게임</div>
                    <div className="text-sm font-medium">
                      {getGameTypeDisplay(user.preferGame)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">3구 능력치</div>
                    <div className="text-sm font-medium">
                      레벨 {Math.floor(Math.random() * 10)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">4구 능력치</div>
                    <div className="text-sm font-medium">
                      레벨 {Math.floor(Math.random() * 10)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">총 매치 수</div>
                    <div className="text-sm font-medium">
                      {Math.floor(Math.random() * 50)} 회
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-md mb-3 font-medium">신뢰도 정보</h3>
                <div className="mb-2">
                  <div className="mb-1 flex justify-between">
                    <span className="text-xs text-gray-500">신뢰도 점수</span>
                    <span className="text-xs font-semibold">
                      {user.trust_score}점
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
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
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">경고 횟수</div>
                    <div className="text-sm font-medium">
                      {user.warning_count}회
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">차단 상태</div>
                    <div className="text-sm font-medium">
                      {user.is_banned ? (
                        <span className="text-red-600">차단됨</span>
                      ) : (
                        <span className="text-green-600">정상</span>
                      )}
                    </div>
                  </div>
                  {user.is_banned && (
                    <>
                      <div>
                        <div className="text-xs text-gray-500">차단 사유</div>
                        <div className="text-sm">
                          {user.ban_reason || '사유 미기재'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">
                          차단 해제 예정일
                        </div>
                        <div className="text-sm">
                          {user.ban_expires_at
                            ? new Date(user.ban_expires_at).toLocaleDateString(
                                'ko-KR'
                              )
                            : '영구 차단'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-md mb-3 font-medium">관리 메모</h3>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  rows={3}
                  placeholder="사용자에 대한 관리자 메모를 입력하세요."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between border-t pt-6">
            <div>
              <button
                className="mr-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                닫기
              </button>
            </div>
            <div>
              <button
                className="mr-2 rounded-md border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                onClick={user.is_banned ? onUnbanUser : onBanUser}
              >
                {user.is_banned ? '차단 해제' : '사용자 차단'}
              </button>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                정보 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
