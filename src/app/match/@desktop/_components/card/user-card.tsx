'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { MapPin, Star, User, Clock } from 'lucide-react';

import MatchRequest from '../modal/match-modal';
import MatchResultForm from '../modal/match-result';

import { MatchStatus, MatchUser } from '@/types/(match)';

export default function UserCard({ user }: { user: MatchUser }) {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [matchStatus, setMatchStatus] = useState<MatchStatus>({
    canRequest: true,
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
          <MatchRequest
            userId={userId!}
            opponentId={user.mb_id}
            opponentName={user.name}
            onRequestSent={() => {
              checkMatchStatus();
            }}
          />
        ) : null;
    }
  };

  return (
    <div className="mb-4 rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
            <User className="h-18 w-18 text-gray-400" />
          </div>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
            </div>
            <div className="text-right">
              <span className="block text-sm font-medium text-blue-600">
                {user.distance.toFixed(1)}km
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>{user.location}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-sm font-medium">
                  4구: {user.user_four_ability || '-'}점
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-sm font-medium">
                  3구: {user.user_three_ability || '-'}점
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="text-sm">
                <Clock size={14} className="mb-1 mr-1 inline-block" />
                {user.preferred_time || '시간 미설정'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" className="text-sm">
          프로필 보기
        </Button>
        {renderMatchButton()}
      </div>
    </div>
  );
}
