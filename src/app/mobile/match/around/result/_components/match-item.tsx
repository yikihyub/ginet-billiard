'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { MatchItemActions } from './match-item-action';
import { Match } from '@/types/(match)';
import { formatGameType, getTimeStatus, getOpponentId } from '@/lib/utils';

interface MatchItemProps {
  match: Match;
  userId: string;
  activeTab: string;
  handleCheckIn: (matchId: number) => Promise<void>;
  handleReportNoShow: (matchId: number, opponentId: string) => Promise<void>;
  handleComplete: (matchId: number) => void;
  handleEvaluate: (matchId: number) => void;
}

export default function MatchItem({
  match,
  userId,
  activeTab,
  handleCheckIn,
  handleReportNoShow,
  handleComplete,
  handleEvaluate,
}: MatchItemProps) {
  const [distance, setDistance] = useState<number | null>(null);
  const isWithinTimeRange = (
    dateString: string,
    minutesBefore: number,
    minutesAfter: number
  ) => {
    const now = new Date();
    const matchTime = new Date(dateString);
    const msBefore = minutesBefore * 60 * 1000;
    const msAfter = minutesAfter * 60 * 1000;

    return (
      matchTime.getTime() - msBefore <= now.getTime() &&
      now.getTime() <= matchTime.getTime() + msAfter
    );
  };

  const canCheckIn = (match: Match) => {
    return (
      match.match_status === 'ACCEPTED' &&
      isWithinTimeRange(match.preferred_date, 30, 20) &&
      !match.user_checked_in
    );
  };

  const canReportNoShow = (match: Match) => {
    return (
      match.match_status === 'IN_PROGRESS' &&
      match.user_checked_in &&
      !match.opponent_checked_in &&
      isWithinTimeRange(match.match_date, 0, 10)
    );
  };

  const opponentId = getOpponentId(match, userId);

  return (
    <div key={match.match_id} className="px-4 pt-4">
      <div className="flex flex-col items-start justify-center gap-2">
        <div className="w-full">
          {/* 상단 정보 */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">{match.player1_name}</span>
              <span className="text-sm text-gray-500">
                vs {match.player2_name}
              </span>
            </div>
            <Badge
              variant={
                match.game_type === 'THREE_BALL' ? 'default' : 'secondary'
              }
            >
              {formatGameType(match.game_type)}
            </Badge>
          </div>

          {/* 경기 정보 */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              {new Date(match.preferred_date).toLocaleDateString()}{' '}
              {new Date(match.preferred_date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {activeTab === 'ACCEPTED' && (
                <Badge variant="outline" className="ml-2">
                  <Clock className="mr-1 h-3 w-3" />{' '}
                  {getTimeStatus(match.preferred_date)}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-500">상태: </span>
              <span
                className={
                  match.match_status === 'ACCEPTED'
                    ? 'text-blue-500'
                    : match.match_status === 'IN_PROGRESS'
                      ? 'text-green-500'
                      : match.match_status === 'COMPLETED'
                        ? 'text-purple-500'
                        : 'text-gray-500'
                }
              >
                {match.match_status === 'PENDING'
                  ? '대기 중'
                  : match.match_status === 'ACCEPTED'
                    ? '수락됨'
                    : match.match_status === 'IN_PROGRESS'
                      ? '진행 중'
                      : match.match_status === 'COMPLETED'
                        ? '완료됨'
                        : match.match_status === 'EVALUATE'
                          ? '평가 완료'
                          : match.match_status}
              </span>
            </div>

            {/* 체크인 상태 표시 */}
            {(match.match_status === 'ACCEPTED' ||
              match.match_status === 'IN_PROGRESS') && (
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex gap-2">
                  <div className="flex items-center">
                    <CheckCircle
                      className={`mr-1 h-3 w-3 ${
                        match.user_checked_in
                          ? 'text-green-500'
                          : 'text-gray-300'
                      }`}
                    />
                    <span>내 체크인</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle
                      className={`mr-1 h-3 w-3 ${
                        match.opponent_checked_in
                          ? 'text-green-500'
                          : 'text-gray-300'
                      }`}
                    />
                    <span>상대방 체크인</span>
                  </div>
                </div>
                <div>
                  {distance !== null && (
                    <div className="flex items-center justify-end text-xs">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>{Math.round(distance)}m 거리</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No-Show 상태 표시 */}
            {match.no_show_status && (
              <div className="mt-1 flex items-center text-xs text-red-500">
                <AlertCircle className="mr-1 h-3 w-3" />
                <span>No-Show 신고됨: {match.no_show_status}</span>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 영역 */}
        <div className="flex w-full gap-2 border-b pb-4">
          <MatchItemActions
            match={match}
            userId={userId}
            canCheckIn={canCheckIn(match)}
            canReportNoShow={canReportNoShow(match)}
            handleCheckIn={handleCheckIn}
            handleReportNoShow={handleReportNoShow}
            handleComplete={handleComplete}
            handleEvaluate={handleEvaluate}
            opponentId={opponentId}
            onDistanceChange={setDistance}
          />
        </div>
      </div>
    </div>
  );
}
