// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { useSession } from 'next-auth/react';
// import { ChevronLeft } from 'lucide-react';
// import { Match } from '@/types/(match)';

// export default function MatchManagementPage() {
//   const { data: session } = useSession();
//   const userId = session?.user.mb_id;
//   const [activeTab, setActiveTab] = useState('ACCEPTED');
//   const [matches, setMatches] = useState<Match[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     fetchMatches(activeTab);
//   }, [activeTab]);

//   const fetchMatches = async (status: string) => {
//     try {
//       const response = await fetch(
//         `/api/match/mymatch/detailmymatch?userId=${userId}&status=${status}`
//       );
//       const data = await response.json();
//       setMatches(data);
//     } catch (error) {
//       console.error('경기 목록 가져오기 오류:', error);
//     }
//   };

//   const handleComplete = async (matchId: number) => {
//     // 모달 대신 별도 폼 페이지로 이동
//     router.push(`/match/result/${matchId}/complete`);
//   };

//   const handleEvaluate = async (matchId: number) => {
//     router.push(`/management/eva/${matchId}`);
//   };

//   if (!matches) {
//     return <div>등록된 경기가 없습니다...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="flex p-4">
//         <div onClick={() => router.back()} className="">
//           <ChevronLeft />
//         </div>
//         <div className="pl-4 text-center font-bold">경기 관리</div>
//       </div>

//       {/* 탭 네비게이션 */}
//       <div className="flex border-b">
//         <button
//           className={`flex-1 px-4 py-2 text-sm ${activeTab === 'ACCEPTED' ? 'border-b-2 border-green-500 font-bold' : 'font-semibold text-gray-400'}`}
//           onClick={() => setActiveTab('ACCEPTED')}
//         >
//           예정 경기
//         </button>
//         <button
//           className={`flex-1 px-4 py-2 text-sm ${activeTab === 'IN_PROGRESS' ? 'border-b-2 border-green-500 font-bold' : 'font-semibold text-gray-400'}`}
//           onClick={() => setActiveTab('IN_PROGRESS')}
//         >
//           진행 경기
//         </button>
//         <button
//           className={`flex-1 px-4 py-2 text-sm ${activeTab === 'COMPLETED' ? 'border-b-2 border-green-500 font-bold' : 'font-semibold text-gray-400'}`}
//           onClick={() => setActiveTab('COMPLETED')}
//         >
//           완료 경기
//         </button>
//       </div>

//       {/* 경기 목록 */}
//       <div className="">
//         {matches.length === 0 ? (
//           <p className="py-8 text-center text-gray-500">
//             경기 내역이 없습니다.
//           </p>
//         ) : (
//           matches.map((match) => (
//             <div key={match.match_id} className="pl-4 pr-4 pt-4">
//               <div className="flex flex-col items-start justify-center gap-2">
//                 <div>
//                   <div className="mb-2 flex items-center gap-2">
//                     <span className="font-bold">{match.player1_name}</span>
//                     <span className="text-sm text-gray-500">
//                       vs {match.player2_name}
//                     </span>
//                   </div>
//                   <p className="text-sm">
//                     일시: {new Date(match.match_date).toLocaleString()}
//                   </p>
//                   <p className="text-sm">
//                     상태:{' '}
//                     <span
//                       className={
//                         match.match_status === 'ACCEPTED'
//                           ? 'text-green-500'
//                           : match.match_status === 'IN_PROGRESS'
//                             ? 'text-green-500'
//                             : match.match_status === 'COMPLETED'
//                               ? 'text-purple-500'
//                               : 'text-gray-500'
//                       }
//                     >
//                       {match.match_status === 'PENDING'
//                         ? '대기 중'
//                         : match.match_status === 'ACCEPTED'
//                           ? '수락됨'
//                           : match.match_status === 'IN_PROGRESS'
//                             ? '진행 중'
//                             : match.match_status === 'COMPLETED'
//                               ? '완료됨'
//                               : match.match_status === 'EVALUATE'
//                                 ? '평가 완료'
//                                 : match.match_status}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="flex w-full gap-2 border-b pb-4">
//                   <Button className="w-full bg-gray-100 font-semibold text-gray-500 shadow-none">
//                     상세 정보
//                   </Button>

//                   {match.match_status === 'ACCEPTED' && (
//                     <Button
//                       className="w-full bg-gray-100 font-semibold text-gray-500 shadow-none"
//                       onClick={() => handleComplete(match.match_id)}
//                     >
//                       경기 취소
//                     </Button>
//                   )}

//                   {match.match_status === 'IN_PROGRESS' && (
//                     <Button
//                       className="w-full bg-gray-100 font-semibold text-gray-500 shadow-none"
//                       onClick={() => handleComplete(match.match_id)}
//                     >
//                       경기 진행중
//                     </Button>
//                   )}

//                   {match.match_status === 'COMPLETED' && (
//                     <Button
//                       className="w-full bg-gray-100 font-semibold text-gray-500 shadow-none"
//                       onClick={() => handleEvaluate(match.match_id)}
//                     >
//                       평가하기
//                     </Button>
//                   )}

//                   {match.match_status === 'EVALUATE' && (
//                     <span className="text-sm text-green-500">평가 완료</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import {
  ChevronLeft,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Match } from '@/types/(match)';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function MatchManagementPage() {
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const [activeTab, setActiveTab] = useState('ACCEPTED');
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('ALL');
  const router = useRouter();
  const { toast } = useToast();

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
      console.log(matches);
      setFilteredMatches(data);
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

  const handleCheckIn = async (matchId: number) => {
    try {
      const response = await fetch('/api/match/checkin', {
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
        // 목록 새로고침
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
        // 목록 새로고침
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

  const getOpponentId = (match: Match) => {
    return match.player1_id === userId ? match.player2_id : match.player1_id;
  };

  // 시간 관련 헬퍼 함수들
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
    // 경기 시작 30분 전부터 체크인 가능
    return (
      match.match_status === 'ACCEPTED' &&
      isWithinTimeRange(match.match_date, 30, 0) &&
      !match.user_checked_in
    );
  };

  const canReportNoShow = (match: Match) => {
    // 경기 시작 10분 후까지 상대방이 체크인 안 했으면 No-Show 신고 가능
    return (
      match.match_status === 'IN_PROGRESS' &&
      match.user_checked_in &&
      !match.opponent_checked_in &&
      isWithinTimeRange(match.match_date, 0, 10)
    );
  };

  const formatGameType = (type: string) => {
    switch (type) {
      case 'THREE_BALL':
        return '3구';
      case 'FOUR_BALL':
        return '4구';
      default:
        return type;
    }
  };

  const getTimeStatus = (dateString: string) => {
    const now = new Date();
    const matchTime = new Date(dateString);
    const diffHours = (matchTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) return '지남';
    if (diffHours < 1) return `${Math.round(diffHours * 60)}분 후`;
    return `${Math.round(diffHours)}시간 후`;
  };

  if (!userId) {
    return <div className="p-4 text-center">로그인이 필요합니다.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center border-b p-4">
          <div onClick={() => router.back()} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <div className="pl-4 text-lg font-bold">경기 관리</div>
        </div>

        {/* 검색 및 필터 */}
        <div className="border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="상대방 이름 검색"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="mt-2 space-y-2 rounded-md bg-gray-50 p-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={gameTypeFilter === 'ALL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGameTypeFilter('ALL')}
                  className="flex-1"
                >
                  전체
                </Button>
                <Button
                  variant={
                    gameTypeFilter === 'THREE_BALL' ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setGameTypeFilter('THREE_BALL')}
                  className="flex-1"
                >
                  3구
                </Button>
                <Button
                  variant={
                    gameTypeFilter === 'FOUR_BALL' ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setGameTypeFilter('FOUR_BALL')}
                  className="flex-1"
                >
                  4구
                </Button>
              </div>
            </div>
          )}
        </div>

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
      </div>

      {/* 경기 목록 */}
      <div className="pb-20">
        {filteredMatches.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            {searchTerm || dateFilter || gameTypeFilter !== 'ALL'
              ? '검색 결과가 없습니다.'
              : '경기 내역이 없습니다.'}
          </p>
        ) : (
          filteredMatches.map((match) => (
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
                        match.game_type === 'THREE_BALL'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {formatGameType(match.game_type)}
                    </Badge>
                  </div>

                  {/* 경기 정보 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(match.match_date).toLocaleDateString()}{' '}
                      {new Date(match.match_date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {activeTab === 'ACCEPTED' && (
                        <Badge variant="outline" className="ml-2">
                          <Clock className="mr-1 h-3 w-3" />{' '}
                          {getTimeStatus(match.match_date)}
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
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center">
                          <CheckCircle
                            className={`mr-1 h-3 w-3 ${match.user_checked_in ? 'text-green-500' : 'text-gray-300'}`}
                          />
                          <span>내 체크인</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle
                            className={`mr-1 h-3 w-3 ${match.opponent_checked_in ? 'text-green-500' : 'text-gray-300'}`}
                          />
                          <span>상대방 체크인</span>
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
                  <Button
                    variant="outline"
                    className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      router.push(`/match/detail/${match.match_id}`)
                    }
                  >
                    상세 정보
                  </Button>

                  {match.match_status === 'ACCEPTED' && canCheckIn(match) && (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleCheckIn(match.match_id)}
                    >
                      체크인하기
                    </Button>
                  )}

                  {match.match_status === 'ACCEPTED' && !canCheckIn(match) && (
                    <Button
                      className="flex-1 bg-gray-100 text-gray-500 hover:bg-gray-200"
                      onClick={() => handleComplete(match.match_id)}
                    >
                      경기 취소
                    </Button>
                  )}

                  {match.match_status === 'IN_PROGRESS' &&
                    canReportNoShow(match) && (
                      <Button
                        className="flex-1 bg-red-600 text-white hover:bg-red-700"
                        onClick={() =>
                          handleReportNoShow(
                            match.match_id,
                            getOpponentId(match)
                          )
                        }
                      >
                        No-Show 신고
                      </Button>
                    )}

                  {match.match_status === 'IN_PROGRESS' &&
                    !canReportNoShow(match) && (
                      <Button
                        className="flex-1 bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleComplete(match.match_id)}
                      >
                        경기 종료
                      </Button>
                    )}

                  {match.match_status === 'COMPLETED' && !match.has_rated && (
                    <Button
                      className="flex-1 bg-yellow-600 text-white hover:bg-yellow-700"
                      onClick={() => handleEvaluate(match.match_id)}
                    >
                      평가하기
                    </Button>
                  )}

                  {match.match_status === 'COMPLETED' && match.has_rated && (
                    <Button
                      className="flex-1 bg-purple-100 text-purple-700"
                      disabled
                    >
                      평가 완료
                    </Button>
                  )}

                  {match.match_status === 'EVALUATE' && (
                    <span className="flex flex-1 items-center justify-center text-sm text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" /> 평가 완료
                    </span>
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
