'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

import { MatchContextType, RegisteredPlayer } from '../../../_types';

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<RegisteredPlayer[]>([]);
  const [processingMatchId, setProcessingMatchId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userId = session?.user.mb_id;

  const activeMatches = players.filter(
    (player) => player.status === 'active'
  ).length;
  const totalPlayers = 0;

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
        `/api/match/status?otherUserId=${player.bi_user.mb_id}&currentUserId=${userId}`
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

  const value = {
    players,
    isLoading,
    processingMatchId,
    activeMatches,
    totalPlayers,
    searchQuery,
    activeTab,
    userId: userId!,
    fetchPlayers,
    handleMatchRequest,
    setSearchQuery,
    setActiveTab,
  };

  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
