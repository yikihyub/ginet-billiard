'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useToast } from '@/hooks/use-toast';
import { MatchStatus } from '../../../_types';

import { ConfirmationModal } from '../modal/confirm-modal';
import UserActionsDrawer from '../button/detail-button';

export default function UserCard({ user }: any) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [loading, setLoading] = useState(true);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>({
    canRequest: true,
    isRequester: false,
    status: undefined,
    matchId: null,
    matchRole: 'NONE',
    hasPendingMatches: false,
    hasUnratedMatches: false,
    hasRated: false,
    existingMatch: null,
    activeRequestsCount: 0,
    maxRequests: 3,
    hasPenalty: false,
    penaltyExpiresAt: null,
    otherUserHasActiveMatch: false,
    otherUserMatchStatus: 'NONE',
  });
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    checkMatchStatus();
  }, [userId, user.mb_id]);

  // 경기 상태값 확인
  const checkMatchStatus = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/match/status?currentUserId=${userId}&otherUserId=${user.mb_id}`
      );
      const data = await response.json();

      setMatchStatus({
        canRequest: data.canRequest,
        status: data.matchStatus,
        matchId: data.matchId,
        isRequester: data.isRequester,
        matchRole: data.matchRole,
        hasPendingMatches: data.hasPendingMatches,
        hasUnratedMatches: data.hasUnratedMatches,
        hasRated: data.hasRated,
        existingMatch: data.existingMatch,
        activeRequestsCount: data.activeRequestsCount || 0,
        maxRequests: data.maxRequests || 3,
        hasPenalty: data.hasPenalty || false,
        penaltyExpiresAt: data.penaltyExpiresAt || null,
        otherUserHasActiveMatch: data.otherUserHasActiveMatch,
        otherUserMatchStatus: data.otherUserMatchStatus,
      });
    } catch (error) {
      console.error('매치 상태 확인 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchResponse = async (
    matchId: string,
    response: 'ACCEPT' | 'REJECT'
  ) => {
    if (!userId) return;

    try {
      setLoading(true);

      const apiResponse = await fetch(`/api/match/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          response,
          userId,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error('매치 응답 처리 중 오류가 발생했습니다.');
      }
      // const matchData = await apiResponse.json();
      checkMatchStatus();
    } catch (error) {
      console.error('매치 응답 처리 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMatch = async (matchId: string) => {
    if (!confirm('경기를 종료하시겠습니까?')) return;

    try {
      setLoading(true);
      const response = await fetch('/api/match/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '경기 종료 처리에 실패했습니다.');
      }

      // 상태 업데이트
      setMatchStatus((prev) => ({ ...prev, status: 'COMPLETED' }));
      toast({ title: '경기가 종료되었습니다. 상대방을 평가해주세요!' });

      // 필요하다면 평가 페이지로 리디렉션
      router.push(`/mobile/match/rate/${matchId}`);
    } catch (error) {
      console.error('경기 종료 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 모달 열기 함수
  const openMatchModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeMatchModal = () => {
    setIsModalOpen(false);
  };

  const renderMatchButton = () => {
    if (loading) {
      return <Button disabled>로딩중...</Button>;
    }

    // 매치 상태 기반 렌더링
    switch (matchStatus.status) {
      case 'PENDING':
        if (matchStatus.matchRole === 'REQUESTER') {
          // 내가 요청자라면 대기중 버튼 표시
          return (
            <Button
              variant="outline"
              className="focus:none text-md h-14 w-full rounded-md border border-gray-200 bg-white px-3 py-1 font-bold text-[#333] shadow-none"
            >
              매칭 대기중
            </Button>
          );
        } else if (matchStatus.matchRole === 'RECEIVER') {
          // 내가 수신자라면 상세보기 버튼 표시 - 모달을 열기 위한 버튼으로 변경
          return (
            <Button
              onClick={openMatchModal}
              className="text-md h-14 w-full rounded-md bg-green-600 px-3 py-1 font-bold text-white hover:bg-green-700"
            >
              매치 상세 보기
            </Button>
          );
        } else {
          // 다른 사람들에게는 대기중 버튼 표시 (비활성화 상태)
          return (
            <Button
              variant="outline"
              disabled
              className="focus:none text-md h-14 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-1 font-bold text-gray-400 shadow-none"
            >
              다른 회원과 매칭 진행중
            </Button>
          );
        }

      case 'ACCEPTED':
        if (
          matchStatus.matchRole === 'REQUESTER' ||
          matchStatus.matchRole === 'RECEIVER'
        ) {
          return (
            <Button
              variant="outline"
              className="focus:none text-md h-14 w-full rounded-md border border-gray-200 bg-white px-3 py-1 font-bold text-[#333] shadow-none"
            >
              매칭 성사됨
            </Button>
          );
        } else {
          // 제3자에게 보여지는 버튼
          return (
            <Button
              variant="outline"
              disabled
              className="focus:none text-md h-14 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-1 font-bold text-gray-400 shadow-none"
            >
              다른 회원과 매칭 성사됨
            </Button>
          );
        }

      case 'IN_PROGRESS':
        if (
          matchStatus.matchRole === 'REQUESTER' ||
          matchStatus.matchRole === 'RECEIVER'
        ) {
          return (
            <div className="flex w-full flex-col gap-2">
              <Button
                variant="default"
                onClick={() => handleCompleteMatch(matchStatus.matchId!)}
                className="text-md h-14 w-full rounded-md bg-blue-600 px-3 py-1 font-bold text-white hover:bg-blue-700"
              >
                경기 종료하기
              </Button>
            </div>
          );
        } else {
          // 제3자에게 보여지는 버튼
          return (
            <Button
              variant="outline"
              disabled
              className="focus:none text-md h-14 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-1 font-bold text-gray-400 shadow-none"
            >
              다른 회원과 경기 진행중
            </Button>
          );
        }

      case 'COMPLETED':
        if (
          matchStatus.matchRole === 'REQUESTER' ||
          matchStatus.matchRole === 'RECEIVER'
        ) {
          if (!matchStatus.hasRated) {
            // 내가 참여자이고 아직 평가하지 않은 경우
            return (
              <div className="flex w-full gap-2">
                <Button
                  variant="default"
                  onClick={() =>
                    router.push(`/mobile/management/eva/${matchStatus.matchId}`)
                  }
                  className="text-md h-14 w-full flex-1 rounded-md bg-yellow-600 px-3 py-1 font-bold text-white hover:bg-yellow-700"
                >
                  평가하기
                </Button>
              </div>
            );
          } else {
            // 이미 평가한 경우
            return (
              <Button
                variant="outline"
                className="focus:none text-md h-14 w-full rounded-md border border-gray-200 bg-white px-3 py-1 font-bold text-[#333] shadow-none"
              >
                경기 종료
              </Button>
            );
          }
        } else {
          // 제3자에게 보여지는 버튼
          return (
            <Button
              variant="outline"
              disabled
              className="focus:none text-md h-14 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-1 font-bold text-gray-400 shadow-none"
            >
              다른 회원과 경기 종료됨
            </Button>
          );
        }

      default:
        // 매치가 없는 경우
        if (matchStatus.hasPenalty) {
          // 패널티가 있는 경우
          const expiresDate = matchStatus.penaltyExpiresAt
            ? new Date(matchStatus.penaltyExpiresAt).toLocaleDateString('ko-KR')
            : '알 수 없음';

          return (
            <Button
              disabled
              className="text-md h-14 w-full rounded-md bg-red-400 px-3 py-1 font-bold text-white"
              title={`'매칭 제한'} (해제: ${expiresDate})`}
            >
              매칭 제한됨
            </Button>
          );
        } else if (matchStatus.activeRequestsCount >= matchStatus.maxRequests) {
          // 최대 요청 수에 도달한 경우
          return (
            <Button
              disabled
              className="text-md h-14 w-full rounded-md bg-amber-400 px-3 py-1 font-bold text-white"
              title={`최대 ${matchStatus.maxRequests}개의 매칭 요청만 가능합니다`}
            >
              요청 한도 도달
            </Button>
          );
        } else if (matchStatus.otherUserHasActiveMatch) {
          // 카드의 사용자가 이미 다른 사람과 매치 중인 경우
          return (
            <Button
              disabled
              className="text-md h-14 w-full rounded-md bg-gray-400 px-3 py-1 font-bold text-white"
              title="이 사용자는 현재 다른 매치 진행 중입니다"
            >
              경기신청 불가
            </Button>
          );
        } else if (matchStatus.canRequest) {
          return (
            <Button
              onClick={() =>
                router.push(
                  `/mobile/match/request?opponent=${user.mb_id}&name=${encodeURIComponent(user.name)}`
                )
              }
              className="text-md h-14 w-full rounded-md bg-green-600 px-3 py-1 font-bold text-white hover:bg-green-700"
            >
              경기신청
            </Button>
          );
        } else if (
          matchStatus.hasPendingMatches ||
          matchStatus.hasUnratedMatches
        ) {
          // 진행 중 매치가 있거나 미평가 매치가 있는 경우 모두 동일한 버튼으로 표시
          let title = '현재 경기 신청이 불가능합니다';
          if (matchStatus.hasPendingMatches) {
            title = '이미 진행 중인 매칭이 있습니다';
          } else if (matchStatus.hasUnratedMatches) {
            title = '평가해야 할 경기가 있습니다';
          }

          return (
            <Button
              disabled
              className="text-md h-14 w-full rounded-md bg-gray-400 px-3 py-1 font-bold text-white"
              title={title}
            >
              경기신청 불가
            </Button>
          );
        } else {
          return (
            <Button
              disabled
              className="w-full rounded-md bg-gray-400 px-3 py-1 text-white"
              title="현재 경기 신청이 불가능합니다  h-14 text-md font-bold"
            >
              경기신청 불가
            </Button>
          );
        }
    }
  };

  const moveUrl = () => {
    router.push(`/mobile/match/around/profile?userName=${user.name}`);
  };

  return (
    <>
      <li className="py-4">
        <div className="mb-3 flex flex-col">
          <div className="mb-2 flex justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={'/logo/billiard-ball.png'}
                  alt={user.name || '사용자'}
                />
                <AvatarFallback>
                  {user.name ? user.name.slice(0, 2) : '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{user.name || '이름 없음'}</div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{user.level}</span>
                  <span className="mx-1">·</span>
                  <span>0 경기</span>
                  {/* {user.matchCount} */}
                  <span className="mx-1">·</span>
                  <span>{user.distance.toFixed(1)}km</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-green-700 px-2 py-0.5 text-xs font-medium text-white">
                {user.preferGame === 'THREE_BALL'
                  ? '3구'
                  : user.preferGame === 'FOUR_BALL'
                    ? '4구'
                    : '포켓볼'}
              </div>
              <div>
                <UserActionsDrawer
                  userId={user.mb_id}
                  username={user.name}
                  moveUrl={moveUrl}
                />
              </div>
            </div>
          </div>

          {/* 왼쪽 개인정보 */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex divide-x divide-border text-center text-sm">
              {/* 왼쪽 박스 */}
              <div className="flex-1 px-4">
                <div className="font-medium text-muted-foreground">3구</div>
                <div className="mt-1 text-black">
                  {user.user_four_ability || 0}
                </div>
              </div>

              {/* 가운데 박스 */}
              <div className="flex-1 px-4">
                <div className="font-medium text-muted-foreground">4구</div>
                <div className="mt-1 text-black">
                  {user.user_three_ability || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 하단 버튼 */}
        <div className="mt-1 flex justify-end gap-2">
          {/* <div className="flex-1">
            <Button
              onClick={moveUrl}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-[#333] shadow-none hover:bg-white focus:outline-none"
            >
              프로필
            </Button>
          </div> */}
          <div className="flex-1">{renderMatchButton()}</div>
        </div>
      </li>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeMatchModal}
        matchId={matchStatus.matchId || ''}
        opponentId={user.mb_id}
        onAccept={(matchId) => handleMatchResponse(matchId, 'ACCEPT')}
        onReject={(matchId) => handleMatchResponse(matchId, 'REJECT')}
      />
    </>
  );
}
