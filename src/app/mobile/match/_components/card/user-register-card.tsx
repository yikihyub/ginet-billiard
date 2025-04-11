'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useToast } from '@/hooks/use-toast';
import { RegisteredPlayer } from '@/types/(match)';

import { Search, TrendingUp, Calendar, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';

import {
  CalendarIcon,
  MapPinIcon,
  FileText,
  Plus,
  RefreshCcw,
} from 'lucide-react';

import Link from 'next/link';

export default function UserRegisterCard() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<RegisteredPlayer[]>([]);
  const [processingMatchId, setProcessingMatchId] = useState<string | null>(
    null
  );

  // const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeMatches = players.filter(
    (player) => player.status === 'active'
  ).length;
  const totalPlayers = 0;

  const userId = session?.user.mb_id;

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/match/register/getreg');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: '불러오기 실패',
        description: '선수 목록을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getGameTypeLabel = (type: string) => {
    const types = {
      FOUR_BALL: '4구',
      THREE_BALL: '3구',
      POCKET_BALL: '포켓볼',
    };
    return types[type as keyof typeof types] || type;
  };

  const getMatchTypeLabel = (type: string) => {
    const types = {
      ONE_VS_ONE: '1:1',
      TWO_VS_TWO: '2:2',
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      'default' | 'destructive' | 'secondary' | 'outline'
    > = {
      PENDING: 'default',
      ACCEPTED: 'secondary',
      IN_PROGRESS: 'outline',
      COMPLETED: 'destructive',
    };

    const labels = {
      PENDING: '대기중',
      ACCEPTED: '매칭완료',
      IN_PROGRESS: '경기중',
      COMPLETED: '경기종료',
      CANCELLED: '취소됨',
    };

    return (
      <Badge className="bg-green-700" variant={variants[status] || 'default'}>
        {labels[status as keyof typeof labels] || '알 수 없음'}
      </Badge>
    );
  };

  const handleMatchRequest = async (player: RegisteredPlayer) => {
    if (!session?.user?.mb_id) {
      toast({
        title: '로그인 필요',
        description: '매치 신청을 위해 로그인해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessingMatchId(player.bi_user.mb_id);

      // 먼저 현재 진행 중인 매치가 있는지 확인
      const statusCheck = await fetch(
        `/api/match/status?player1_id=${player.bi_user.mb_id}&player2_id=${userId}`
      );
      const statusData = await statusCheck.json();

      if (statusData.existingMatch) {
        toast({
          title: '매치 신청 불가',
          description: '이미 진행 중인 매치가 있습니다.',
          variant: 'destructive',
        });
        return;
      }

      // 새로운 매치 생성
      const response = await fetch('/api/match/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1_id: userId,
          player2_id: player.bi_user.mb_id,
          game_type: player.game_type,
          preferred_date: player.match_date,
          location: player.billiard_place,
          message: '매치를 신청합니다.',
        }),
      });

      if (!response.ok) {
        throw new Error('매치 신청에 실패했습니다.');
      }

      toast({
        title: '매치 신청 완료',
        description: '상대방의 수락을 기다립니다.',
      });
    } catch (error) {
      console.error('Match request error:', error);
      toast({
        title: '매치 신청 실패',
        description:
          error instanceof Error
            ? error.message
            : '매치 신청 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setProcessingMatchId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">로딩중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">매치 등록 현황</div>
      </div>

      {/* 통계 정보 배너 */}
      <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3">
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <div className="mb-1 flex items-center gap-1 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">활성 매치</span>
          </div>
          <span className="font-semibold">{activeMatches}개</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <div className="mb-1 flex items-center gap-1 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-xs">총 경기</span>
          </div>
          <span className="font-semibold">{totalPlayers}명</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <div className="mb-1 flex items-center gap-1 text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">인기 종목</span>
          </div>
          <span className="font-semibold">4구</span>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="매치 검색..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={fetchPlayers}>
            <RefreshCcw />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {players.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              등록된 경기가 없습니다.
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              첫 번째로 경기를 등록해보세요.
            </p>
            <Link href="/mobile/team-match">
              <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
                <Plus size={16} />
                <span>경기 등록하기</span>
              </Button>
            </Link>
          </div>
        ) : (
          players.map((player) => (
            <Card key={player.id} className="overflow-hidden shadow-none">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          '/logo/billiard-ball.png'
                          // player.bi_user?.profile_image || ''
                        }
                      />
                      <AvatarFallback>
                        {player.bi_user?.name
                          ? player.bi_user.name.slice(0, 2)
                          : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {player.bi_user?.name || '이름 없음'}
                      </div>
                    </div>
                  </div>
                  <div>{getStatusBadge(player.status)}</div>
                </div>

                <div className="mt-2 space-y-2 text-sm">
                  {/* <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">게임 유형:</div>
                    <div>{getGameTypeLabel(player.game_type)}</div>

                    <div className="font-medium">매치 유형:</div>
                    <div>{getMatchTypeLabel(player.match_type)}</div>
                  </div> */}

                  <div className="flex divide-x divide-border text-center text-sm">
                    {/* 왼쪽 박스 */}
                    <div className="flex-1 px-4">
                      <div className="font-medium text-muted-foreground">
                        게임 유형
                      </div>
                      <div className="mt-1 text-black">
                        {getGameTypeLabel(player.game_type)}
                      </div>
                    </div>

                    {/* 오른쪽 박스 */}
                    <div className="flex-1 px-4">
                      <div className="font-medium text-muted-foreground">
                        매치 유형
                      </div>
                      <div className="mt-1 text-black">
                        {getMatchTypeLabel(player.match_type)}
                      </div>
                    </div>

                    <div>
                      <div className="flex-1 px-4">
                        <div className="font-medium text-muted-foreground">
                          당구 수지
                        </div>
                        <div className="mt-1 text-black">{player.handicap}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 bg-gray-50 p-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPinIcon className="mr-1 h-4 w-4" />
                      <span
                        className="truncate"
                        title={player.billiard_place || ''}
                      >
                        매칭장소 : {player.billiard_place || '장소 미정'}
                      </span>
                    </div>

                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      <span>
                        등록날짜 :&nbsp;
                        {new Date(player.created_at).toLocaleDateString(
                          'ko-KR',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {userId !== player.bi_user.mb_id &&
                  player.status === 'PENDING' && (
                    <div className="mt-4">
                      <Button
                        onClick={() => handleMatchRequest(player)}
                        disabled={processingMatchId === player.bi_user.mb_id}
                        variant="default"
                        size="lg"
                        className="h-12 w-full bg-green-600 text-white"
                      >
                        {processingMatchId === player.bi_user.mb_id
                          ? '처리중...'
                          : '매치 신청'}
                      </Button>
                    </div>
                  )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
