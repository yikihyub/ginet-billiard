'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useToast } from '@/hooks/use-toast';
import { RegisteredPlayer } from '@/types/(match)';

export default function UserRegisterCard() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<RegisteredPlayer[]>([]);
  const [processingMatchId, setProcessingMatchId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/match/register/getreg');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
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

    return (
      <Badge variant={variants[status] || 'default'}>
        {status === 'PENDING'
          ? '대기중'
          : status === 'ACCEPTED'
            ? '매칭완료'
            : status === 'IN_PROGRESS'
              ? '경기중'
              : status === 'COMPLETED'
                ? '경기종료'
                : '취소됨'}
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">로딩중...</div>
      </div>
    );
  }

  return (
    <Card>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>선수</TableHead>
              <TableHead>다마</TableHead>
              <TableHead>게임</TableHead>
              <TableHead>매치</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>등록일시</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {player.bi_user?.name
                        ? player.bi_user.name.slice(0, 2)
                        : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{player.bi_user?.name || '이름 없음'}</span>
                </TableCell>
                <TableCell>{player.handicap}</TableCell>
                <TableCell>{getGameTypeLabel(player.game_type)}</TableCell>
                <TableCell>{getMatchTypeLabel(player.match_type)}</TableCell>
                <TableCell>{getStatusBadge(player.status)}</TableCell>
                <TableCell>
                  {new Date(player.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  {userId !== player.bi_user.mb_id && (
                    <Button
                      onClick={() => handleMatchRequest(player)}
                      disabled={processingMatchId === player.bi_user.mb_id}
                      variant="outline"
                      size="sm"
                    >
                      {processingMatchId === player.bi_user.mb_id
                        ? '처리중...'
                        : '매치 신청'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
