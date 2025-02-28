'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Medal, X, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

interface MyMatchesCardProps {
  userId: string;
}

export default function MyMatchesCard({ userId }: MyMatchesCardProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchMyMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/match/mymatch?userId=${userId}`);

        if (!response.ok) {
          throw new Error('매치 정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setMatches(data);
      } catch (err) {
        console.error('매치 조회 오류:', err);
        setError(
          err instanceof Error
            ? err.message
            : '데이터를 불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyMatches();
  }, [userId]);

  // 내가 요청한 매치, 받은 매치 필터링
  const pendingMatches = matches.filter((m) => m.match_status === 'PENDING');
  const activeMatches = matches.filter((m) =>
    ['ACCEPTED', 'IN_PROGRESS'].includes(m.match_status)
  );
  const completedMatches = matches.filter((m) =>
    ['COMPLETED', 'EVALUATE'].includes(m.match_status)
  );

  // 상대방 정보 가져오기
  const getOpponentInfo = (match: Match) => {
    const isPlayer1 = match.player1_id === userId;
    return {
      name: isPlayer1 ? match.player2_name : match.player1_name,
      image: isPlayer1 ? match.player2_image : match.player1_image,
      dama: isPlayer1 ? match.player2_dama : match.player1_dama,
      id: isPlayer1 ? match.player2_id : match.player1_id,
    };
  };

  // 게임 타입 표시 텍스트
  const getGameTypeText = (gameType: string) => {
    switch (gameType) {
      case 'FOUR_BALL':
        return '4구';
      case 'THREE_BALL':
        return '3구';
      case 'POCKET_BALL':
        return '포켓볼';
      default:
        return gameType;
    }
  };

  // 상태에 따른 배지 컴포넌트
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-purple-100">
            대기중
          </Badge>
        );
      case 'ACCEPTED':
        return (
          <Badge variant="outline" className="bg-blue-100">
            매치 성사
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-green-100">
            경기중
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-gray-100">
            완료
          </Badge>
        );
      case 'EVALUATE':
        return (
          <Badge variant="outline" className="bg-yellow-100">
            평가중
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-red-100">
            거절됨
          </Badge>
        );
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  // 승패 여부 확인
  const getResultText = (match: Match) => {
    if (!match.winner_id || !match.loser_id) return '기록 없음';

    if (match.winner_id === userId) {
      return <span className="font-medium text-green-600">승리</span>;
    } else if (match.loser_id === userId) {
      return <span className="font-medium text-red-600">패배</span>;
    } else {
      return '결과 없음';
    }
  };

  // 매치 카드 렌더링 함수
  const renderMatchCard = (match: Match) => {
    const opponent = getOpponentInfo(match);
    const matchDate = new Date(match.match_date);
    const formattedDate = matchDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = matchDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <Card key={match.match_id} className="mb-4 overflow-hidden">
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="text-sm">{formattedDate}</span>
              <Clock size={16} className="ml-2" />
              <span className="text-sm">{formattedTime}</span>
            </div>
            {getStatusBadge(match.match_status)}
          </div>

          <div className="flex items-center justify-between pb-4 pt-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <Image
                  src={opponent.image || '/main/profile_img.png'}
                  alt={opponent.name || '상대방'}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback>
                  {opponent.name?.substring(0, 2) || '??'}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="font-medium">
                  {opponent.name || '알 수 없음'}
                </div>
                <div className="text-sm text-gray-500">
                  다마: {opponent.dama || '-'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="mb-1 rounded bg-gray-100 px-2 py-1 text-xs">
                {getGameTypeText(match.game_type)}
              </div>
              {match.match_status === 'COMPLETED' && (
                <div className="flex items-center justify-end gap-1">
                  <Medal size={14} />
                  {getResultText(match)}
                </div>
              )}
            </div>
          </div>

          {(match.match_status === 'COMPLETED' ||
            match.match_status === 'EVALUATE') && (
            <div className="mt-2 flex justify-center rounded-md bg-gray-50 p-2">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500">나</div>
                  <div className="text-xl font-bold">
                    {match.player1_id === userId
                      ? match.player1_score
                      : match.player2_score || '-'}
                  </div>
                </div>
                <div className="text-xl">:</div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">상대</div>
                  <div className="text-xl font-bold">
                    {match.player1_id === userId
                      ? match.player2_score
                      : match.player1_score || '-'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/match/details/${match.match_id}`)}
            >
              상세 보기 <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="ml-3">매치 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-800">
        <X className="mx-auto mb-2 h-8 w-8" />
        <p>{error}</p>
        <Button
          onClick={() => setLoading(true)}
          variant="outline"
          className="mt-4"
        >
          다시 시도
        </Button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center">
        <Calendar className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium">매치 기록이 없습니다</h3>
        <p className="text-gray-500">아직 매치에 참여하지 않았습니다.</p>
        <Button onClick={() => router.push('/match')} className="mt-4">
          매치 찾기
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">내 매치</h2>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            대기중 ({pendingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            진행중 ({activeMatches.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            완료 ({completedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pendingMatches.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              대기 중인 매치가 없습니다
            </div>
          ) : (
            pendingMatches.map(renderMatchCard)
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          {activeMatches.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              진행 중인 매치가 없습니다
            </div>
          ) : (
            activeMatches.map(renderMatchCard)
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedMatches.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              완료된 매치가 없습니다
            </div>
          ) : (
            completedMatches.map(renderMatchCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
