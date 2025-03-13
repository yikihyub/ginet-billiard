'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Star, User, Clock } from 'lucide-react';
import { MatchStatus, MatchUser } from '@/types/(match)';
import MatchResultForm from '../modal/match-result';

export default function UserCard({ user }: { user: MatchUser }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [matchStatus, setMatchStatus] = useState<MatchStatus>({
    canRequest: true,
    isRequester: false,
  });
  const [loading, setLoading] = useState(true);

  const checkMatchStatus = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/match/status?player1_id=${userId}&player2_id=${user.mb_id}`
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

  useEffect(() => {
    checkMatchStatus();
  }, [userId, user.mb_id]);

  const renderMatchButton = () => {
    if (loading) {
      return <Button disabled>로딩중...</Button>;
    }

    switch (matchStatus.status) {
      case 'PENDING':
        return <Button variant="outline">매칭 대기중</Button>;

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
    <div className="mb-4 max-w-md rounded-xl border bg-white p-4 transition-all">
      <div className="flex items-start gap-3">
        {/* 아바타 - 크기 축소 */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <User className="h-7 w-7 text-gray-400" />
        </div>

        <div className="flex-1">
          {/* 상단: 이름, 레벨, 거리 정보를 한 줄에 배치 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">{user.name}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <span>{user.level}</span>
                <span className="mx-1">·</span>
                <span>{user.matchCount}경기</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-sm font-medium text-green-600">
                {user.distance.toFixed(1)}km
              </span>
              <span className="text-xs text-gray-500">{user.lastActive}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 중단: 점수 및 선호 시간 정보 - 더 콤팩트하게 배치 */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-500" />
            <span className="text-xs font-medium">
              4구: {user.user_four_ability || 0}점
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Star size={12} className="text-yellow-500" />
            <span className="text-xs font-medium">
              3구: {user.user_three_ability || 0}점
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-xs">
            <Clock size={12} className="mb-1 mr-1 inline-block" />
            {user.preferredTime}
          </div>
          <div className="text-xs">
            승률:{' '}
            <span className="font-medium text-green-600">{user.winRate}%</span>
          </div>
        </div>
      </div>

      {/* 하단: 태그와 버튼을 한 줄에 배치 */}
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
          {user.preferGame === 'THREE_BALL' ? '3구' : '4구'}
        </span>

        <div className="flex gap-2">
          <button className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
            프로필
          </button>
          {renderMatchButton()}
        </div>
      </div>
    </div>
  );
}
