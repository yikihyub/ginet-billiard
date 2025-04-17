'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Match } from '@/types/(match)';

import MatchTabsWithFilters from './match-tabs';
import ActiveFilters from './active-filter';
import MatchList from './match-list';

export default function MatchResult() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  const [activeTab, setActiveTab] = useState('ACCEPTED');
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab, userId]);

  useEffect(() => {
    // 검색어와 필터 적용
    if (matches) {
      let filtered = [...matches];

      // 검색어 필터링
      if (searchTerm) {
        filtered = filtered.filter(
          (match) =>
            match.player1_name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            match.player2_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // 날짜 필터링
      if (dateFilter) {
        const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
        filtered = filtered.filter((match) => {
          const matchDate = new Date(match.match_date).setHours(0, 0, 0, 0);
          return matchDate === filterDate;
        });
      }

      // 게임 타입 필터링
      if (gameTypeFilter !== 'ALL') {
        filtered = filtered.filter(
          (match) => match.game_type === gameTypeFilter
        );
      }

      setFilteredMatches(filtered);
    }
  }, [matches, searchTerm, dateFilter, gameTypeFilter]);

  const fetchMatches = async (status: string) => {
    try {
      const response = await fetch(
        `/api/match/mymatch/detailmymatch?userId=${userId}&status=${status}`
      );
      const data = await response.json();
      setMatches(data);
      setFilteredMatches(data);
    } catch (error) {
      console.error('경기 목록 가져오기 오류:', error);
    }
  };

  const handleCheckIn = async (matchId: number) => {
    try {
      const response = await fetch('/api/match/checkin/postcheckin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          userId,
        }),
      });

      if (response.ok) {
        toast({
          title: '체크인 완료',
          description: '성공적으로 체크인되었습니다.',
        });
        fetchMatches(activeTab);
      }
    } catch (error) {
      console.error('체크인 오류:', error);
      toast({
        title: '체크인 실패',
        description: '체크인 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleReportNoShow = async (matchId: number, opponentId: string) => {
    if (!confirm('상대방이 나타나지 않았습니까? No-Show로 신고하시겠습니까?'))
      return;

    try {
      const response = await fetch('/api/match/report-no-show', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          reporterId: userId,
          reportedId: opponentId,
        }),
      });

      if (response.ok) {
        toast({
          title: 'No-Show 신고 완료',
          description:
            '신고가 접수되었습니다. 상대방이 15분 내에 응답하지 않으면 자동 처리됩니다.',
        });
        fetchMatches(activeTab);
      }
    } catch (error) {
      console.error('No-Show 신고 오류:', error);
      toast({
        title: '신고 실패',
        description: '신고 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleEvaluate = (matchId: number) => {
    router.push(`/management/eva/${matchId}`);
  };

  const handleViewDetail = async (matchId: number) => {
    try {
      const response = await fetch('/api/match/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          reason: '본인 직접 취소',
        }),
      });

      if (response.ok) {
        toast({
          title: '경기 취소완료',
          description: '성공적으로 완료 되었습니다.',
        });
      }
    } catch (error) {
      console.error('경기취소 오류류:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setGameTypeFilter('ALL');
  };

  const filterProps = {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    gameTypeFilter,
    setGameTypeFilter,
    handleClearFilters,
  };

  return (
    <div className="min-h-screen bg-white">
      <MatchTabsWithFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        gameTypeFilter={gameTypeFilter}
        setGameTypeFilter={setGameTypeFilter}
        handleClearFilters={handleClearFilters}
      />

      {/* <MatchFilters {...filterProps} /> */}

      {(searchTerm || dateFilter || gameTypeFilter !== 'ALL') && (
        <ActiveFilters {...filterProps} />
      )}

      <MatchList
        matches={filteredMatches}
        userId={userId!}
        activeTab={activeTab}
        handleCheckIn={handleCheckIn}
        handleReportNoShow={handleReportNoShow}
        handleComplete={handleViewDetail}
        handleEvaluate={handleEvaluate}
      />
    </div>
  );
}
