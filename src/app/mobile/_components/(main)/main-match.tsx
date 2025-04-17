'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Label } from '@/components/ui/label';

import DateSelector from '@/components/date-selector';
import { Lock } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Match {
  match_id: number;
  match_date: string | Date;
  match_status: string;
  match_type: string;
  game_type: string;
  location?: string;
  player1_id?: string;
  player1_name?: string;
  player1_dama?: number;
  player1_image?: string;
  player2_id?: string;
  player2_name?: string;
  player2_dama?: number;
  player2_image?: string;
}

export default function MainMatch() {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // 날짜 필터를 위한 상태
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (userId) {
      fetchMatches();
    } else {
      setLoading(false);
    }
  }, [userId, selectedDate]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const dateString = selectedDate.toISOString().split('T')[0];

      const response = await fetch(`/api/match/play?date=${dateString}`);
      if (!response.ok) {
        throw new Error('매치 데이터를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('매치 데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 게임 타입별로 매치 필터링
  const fourBallMatches = matches.filter(
    (match) => match.game_type === 'FOUR_BALL'
  );
  const threeBallMatches = matches.filter(
    (match) => match.game_type === 'THREE_BALL'
  );
  const pocketBallMatches = matches.filter(
    (match) => match.game_type === 'POCKET_BALL'
  );

  // 매치 상태 표시를 위한 함수
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return { text: '매치 성사', class: 'bg-blue-100 text-blue-800' };
      case 'IN_PROGRESS':
        return { text: '경기중', class: 'bg-green-100 text-green-800' };
      case 'COMPLETED':
        return { text: '경기 완료', class: 'bg-gray-100 text-gray-800' };
      case 'EVALUATE':
        return { text: '평가 중', class: 'bg-yellow-100 text-yellow-800' };
      case 'PENDING':
        return { text: '대기중', class: 'bg-purple-100 text-purple-800' };
      case 'REJECTED':
        return { text: '거절됨', class: 'bg-red-100 text-red-800' };
      default:
        return { text: '상태 없음', class: 'bg-gray-100 text-gray-800' };
    }
  };

  // 매치 형식 표시를 위한 함수
  const getMatchFormat = (matchType: string) => {
    return matchType === 'ONE_VS_ONE' ? '1vs1' : '2vs2';
  };

  // 매치 카드 렌더링 함수
  const renderMatchCard = (match: Match) => {
    const statusDisplay = getStatusDisplay(match.match_status);
    const matchTime = new Date(match.match_date).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return (
      <div key={match.match_id} className="mt-2 rounded-lg border bg-white p-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">{matchTime}</span>
          <span className={`rounded px-2 py-1 text-sm ${statusDisplay.class}`}>
            {statusDisplay.text}
          </span>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          {match.location || '장소 미정'}
        </div>

        <div className="flex items-center justify-between">
          {/* Player 1 */}
          <div className="flex flex-col items-center">
            <Image
              src={match.player1_image || '/main/profile_img.png'}
              height={80}
              width={80}
              alt={match.player1_name || '선수1'}
              className="mb-2 h-20 w-20 rounded-full object-cover"
            />
            <span className="font-medium">{match.player1_name || '선수1'}</span>
            <span className="text-sm text-gray-600">
              다마: {match.player1_dama || 'N/A'}
            </span>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center px-4">
            <span className="text-2xl font-bold text-gray-400">VS</span>
            <span className="mt-2 rounded bg-gray-100 px-2 py-1 text-sm">
              {getMatchFormat(match.match_type)}
            </span>
          </div>

          {/* Player 2 */}
          <div className="flex flex-col items-center">
            <Image
              height={80}
              width={80}
              src={match.player2_image || '/main/profile_img.png'}
              alt={match.player2_name || '선수2'}
              className="mb-2 h-20 w-20 rounded-full object-cover"
            />
            <span className="font-medium">{match.player2_name || '선수2'}</span>
            <span className="text-sm text-gray-600">
              다마: {match.player2_dama || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="m-auto max-w-1024px space-y-4 px-4 pb-[76px] pt-4">
      <div className="mb-4 flex items-center justify-between pr-4 pt-2">
        <div className="text-md font-bold">경기</div>
        <Link href="/mobile/match-result" className="text-xs text-gray-400">
          <div className="flex items-center">
            전체 보기 <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* 필터 버튼 */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={(date: Date) => setSelectedDate(date)}
      />

      {/* 필터 옵션 */}
      <div className="flex gap-3 text-sm">
        <button className="flex items-center gap-1">
          내 지역 <span>▼</span>
        </button>
        <button className="flex items-center gap-1 text-orange-500">
          🔥 해택
        </button>
        <button>마감 가리기</button>
        <button className="flex items-center gap-1">
          성별 <span>▼</span>
        </button>
        <button className="flex items-center gap-1">
          다마 <span>▼</span>
        </button>
      </div>

      <div className="relative space-y-4">
        {loading ? (
          <div className="py-10 text-center">
            <p>매치 정보를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {threeBallMatches.length > 0 && (
              <div className="mb-4 mt-4">
                <span className="mb-2 ml-2 rounded-lg border border-blue-400 bg-white px-3 py-1 text-blue-600 shadow-sm">
                  3구
                </span>
                {threeBallMatches.map((match) => renderMatchCard(match))}
              </div>
            )}

            {fourBallMatches.length > 0 && (
              <div className="mb-4 mt-4">
                <Label className="mb-2 ml-2 rounded-lg border border-green-400 bg-white px-3 py-1 text-green-600 shadow-sm">
                  4구
                </Label>
                {fourBallMatches.map((match) => renderMatchCard(match))}
              </div>
            )}

            {pocketBallMatches.length > 0 && (
              <>
                <Label className="ml-2 rounded-lg border border-red-400 bg-white px-3 py-1 text-red-600 shadow-sm">
                  포켓볼
                </Label>
                {pocketBallMatches.map((match) => renderMatchCard(match))}
              </>
            )}

            {matches.length === 0 && (
              <div className="min-h-[50vh] py-10 text-center">
                <p>표시할 매치가 없습니다.</p>
              </div>
            )}
          </>
        )}

        {!userId && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-transparent to-gray-900/90 backdrop-blur-sm">
            <Lock className="mb-4 h-12 w-12 text-white" />
            <div className="px-4 text-center text-white">
              <p className="mb-2 text-xl font-semibold">
                자세한 매칭 정보를 보려면 로그인이 필요합니다
              </p>
              <Link href="/login">
                <button className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600">
                  로그인하기
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
