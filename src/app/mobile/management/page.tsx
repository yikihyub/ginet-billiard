'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

interface Match {
  match_id: number;
  match_date: string;
  match_status: string;
  game_type: string;
  match_type: string;
  location?: string;
  player1_id: string;
  player1_name?: string;
  player1_dama?: number;
  player1_image?: string;
  player2_id: string;
  player2_name?: string;
  player2_dama?: number;
  player2_image?: string;
  player1_score?: number;
  player2_score?: number;
  winner_id?: string;
  loser_id?: string;
}

export default function MatchManagementPage() {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [activeTab, setActiveTab] = useState('ACCEPTED');
  const [matches, setMatches] = useState<Match[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab]);

  const fetchMatches = async (status: string) => {
    try {
      const response = await fetch(
        `/api/match/mymatch/detailmymatch?userId=${userId}&status=${status}`
      );
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('경기 목록 가져오기 오류:', error);
    }
  };

  const handleComplete = async (matchId: number) => {
    // 모달 대신 별도 폼 페이지로 이동
    router.push(`/match/result/${matchId}/complete`);
  };

  const handleEvaluate = async (matchId: number) => {
    router.push(`/management/eva/${matchId}`);
  };

  if (!matches) {
    return <div>등록된 경기가 없습니다...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="text-md p-4 font-semibold">경기 관리</div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b">
        <button
          className={`flex-1 px-4 py-2 text-sm ${activeTab === 'ACCEPTED' ? 'border-b-2 border-green-500 font-bold' : 'font-semibold text-gray-400'}`}
          onClick={() => setActiveTab('ACCEPTED')}
        >
          예정 경기
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm ${activeTab === 'IN_PROGRESS' ? 'border-b-2 border-green-500 font-bold' : 'font-semibold text-gray-400'}`}
          onClick={() => setActiveTab('IN_PROGRESS')}
        >
          진행 경기
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm ${activeTab === 'COMPLETED' ? 'border-b-2 border-green-500 font-bold' : 'font-semibold text-gray-400'}`}
          onClick={() => setActiveTab('COMPLETED')}
        >
          완료 경기
        </button>
      </div>

      {/* 경기 목록 */}
      <div className="p-4">
        {matches.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            경기 내역이 없습니다.
          </p>
        ) : (
          matches.map((match) => (
            <div key={match.match_id}>
              <div className="flex flex-col items-start justify-center gap-2">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-bold">{match.player1_name}</span>
                    <span className="text-sm text-gray-500">
                      vs {match.player2_name}
                    </span>
                  </div>
                  <p className="text-sm">
                    일시: {new Date(match.match_date).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    상태:{' '}
                    <span
                      className={
                        match.match_status === 'ACCEPTED'
                          ? 'text-green-500'
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
                  </p>
                </div>

                <div className="flex w-full gap-2 border-b pb-4">
                  <Button className="w-full bg-gray-100 font-semibold text-gray-500 shadow-none">
                    상세 정보
                  </Button>

                  {match.match_status === 'ACCEPTED' && (
                    <Button
                      className="w-full bg-gray-100 font-semibold text-gray-500 shadow-none"
                      onClick={() => handleComplete(match.match_id)}
                    >
                      경기 취소
                    </Button>
                  )}

                  {match.match_status === 'IN_PROGRESS' && (
                    <Button
                      className="w-full bg-gray-100 font-semibold text-gray-500 shadow-none"
                      onClick={() => handleComplete(match.match_id)}
                    >
                      경기 진행중
                    </Button>
                  )}

                  {match.match_status === 'COMPLETED' && (
                    <Button
                      className="w-full bg-gray-100 font-semibold text-gray-500 shadow-none"
                      onClick={() => handleEvaluate(match.match_id)}
                    >
                      평가하기
                    </Button>
                  )}

                  {match.match_status === 'EVALUATE' && (
                    <span className="text-sm text-green-500">평가 완료</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
