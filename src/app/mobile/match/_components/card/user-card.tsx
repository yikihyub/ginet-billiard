'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { MatchStatus, MatchUser } from '@/types/(match)';

import MatchResultForm from '../modal/match-result';
import ProfileModal from '../modal/profile-modal';

import { Star, Clock } from 'lucide-react';
import Image from 'next/image';

export default function UserCard({ user }: { user: MatchUser }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const openProfileModal = () => setProfileOpen(true);
  const closeProfileModal = () => setProfileOpen(false);

  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [matchStatus, setMatchStatus] = useState<MatchStatus>({
    canRequest: true,
    isRequester: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMatchStatus();
  }, [userId, user.mb_id]);

  const checkMatchStatus = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/match/status?currentUserId=${userId}&otherUserId=${user.mb_id}`
      );
      const data = await response.json();

      setMatchStatus({
        canRequest: !data.existingMatch,
        status: data.existingMatch?.match_status,
        matchId: data.existingMatch?.match_id,
        isRequester: data.isRequester,
      });
    } catch (error) {
      console.error('매치 상태 확인 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchResponse = async (
    matchId: number,
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

  const renderMatchButton = () => {
    if (loading) {
      return <Button disabled>로딩중...</Button>;
    }

    switch (matchStatus.status) {
      case 'PENDING':
        if (matchStatus.isRequester) {
          // 내가 요청자라면 대기중 버튼 표시
          return <Button variant="outline">매칭 대기중</Button>;
        } else {
          // 내가 수신자라면 수락/거절 버튼 표시
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  handleMatchResponse(matchStatus.matchId!, 'ACCEPT')
                }
              >
                수락
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  handleMatchResponse(matchStatus.matchId!, 'REJECT')
                }
              >
                거절
              </Button>
            </div>
          );
        }

      case 'ACCEPTED':
        return <Button variant="outline">매칭 성사됨</Button>;

      case 'IN_PROGRESS':
        return <Button variant="outline">경기 진행 중</Button>;

      case 'COMPLETED':
        return (
          <MatchResultForm
            matchId={matchStatus.matchId!}
            player1Id={userId!}
            player2Id={user.mb_id}
            onResultSubmitted={() => {
              checkMatchStatus();
            }}
          />
        );

      default:
        return matchStatus.canRequest ? (
          <Button
            onClick={() =>
              router.push(
                `/match/request?opponent=${user.mb_id}&name=${encodeURIComponent(user.name)}`
              )
            }
            className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
          >
            매칭신청
          </Button>
        ) : null;
    }
  };

  return (
    <>
      <li className="py-3">
        <div className="flex items-center justify-between">
          {/* 좌측: 아바타와 기본 정보 */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Image
                src="/logo/billiard-ball.png"
                alt="user-imgae"
                height={100}
                width={100}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold">{user.name}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <span>{user.level}</span>
                <span className="mx-1">·</span>
                <span>0 경기</span>
                {/* {user.matchCount} */}
                <span className="mx-1">·</span>
                <span>{user.distance.toFixed(1)}km</span>
              </div>

              {/* 태그 */}
              <div className="mt-1">
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                  {user.preferGame === 'THREE_BALL' ? '3구' : '4구'}
                </span>
                <span className="ml-1 text-xs text-gray-500">
                  {user.lastActive}
                </span>
              </div>
            </div>
          </div>

          {/* 우측: 점수와 버튼 */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <Star size={10} className="text-yellow-500" />
              <span className="text-xs font-medium">
                {user.user_four_ability || 0}/{user.user_three_ability || 0}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              <Clock size={10} className="mr-1 inline-block" />
              {user.preferredTime}
            </div>

            <div className="mt-1 flex gap-2">
              <div>
                <Button
                  onClick={openProfileModal}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-[#333] shadow-none"
                >
                  프로필
                </Button>
              </div>
              <div>{renderMatchButton()}</div>
            </div>
          </div>
        </div>
        {/* 확장 상태에서만 표시되는 추가 정보 - 탭하면 표시 가능 */}
        {/* 주석 처리된 확장 영역
      <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-2 text-xs">
        <div>
          <div className="font-medium">능력치</div>
          <div>4구: {user.user_four_ability || 0}점</div>
          <div>3구: {user.user_three_ability || 0}점</div>
          <div>승률: <span className="font-medium text-green-600">{user.winRate}%</span></div>
        </div>
        <div>
          <div className="font-medium">선호 시간</div>
          <div>{user.preferredTime}</div>
        </div>
      </div>
      */}
      </li>

      {/* 프로필 모달 */}
      {profileOpen && <ProfileModal user={user} onClose={closeProfileModal} />}
    </>
  );
}
