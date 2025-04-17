'use client';

import MatchItem from './match-item';
import { Match } from '@/types/(match)';

interface MatchListProps {
  matches: Match[];
  userId: string;
  activeTab: string;
  handleCheckIn: (matchId: number) => Promise<void>;
  handleReportNoShow: (matchId: number, opponentId: string) => Promise<void>;
  handleComplete: (matchId: number) => void;
  handleEvaluate: (matchId: number) => void;
}

export default function MatchList({
  matches,
  userId,
  activeTab,
  handleCheckIn,
  handleReportNoShow,
  handleComplete,
  handleEvaluate,
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">경기 내역이 없습니다.</p>
    );
  }

  return (
    <div>
      {matches.map((match) => (
        <MatchItem
          key={match.match_id}
          match={match}
          userId={userId}
          activeTab={activeTab}
          handleCheckIn={handleCheckIn}
          handleReportNoShow={handleReportNoShow}
          handleComplete={handleComplete}
          handleEvaluate={handleEvaluate}
        />
      ))}
    </div>
  );
}
