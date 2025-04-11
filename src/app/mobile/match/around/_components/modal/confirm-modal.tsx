'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

// 타입 정의
interface MatchDetail {
  match_id: string;
  player1_id: string;
  player2_id: string;
  preferred_date: string | null;
  game_type: string | null;
  location: string | null;
  match_status: string;
  message?: string | null;
  requester?: UserInfo | null;
}

interface UserInfo {
  id: number;
  mb_id: string;
  name: string;
  level?: string;
  matchCount?: number;
  user_three_ability?: number;
  user_four_ability?: number;
}

interface MatchConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  opponentId: string;
  onAccept: (matchId: string) => void;
  onReject: (matchId: string) => void;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  matchId,
  onAccept,
  onReject,
}: MatchConfirmationModalProps) {
  const [loading, setLoading] = useState(true);
  const [matchDetails, setMatchDetails] = useState<MatchDetail | null>(null);

  useEffect(() => {
    if (isOpen && matchId) {
      fetchMatchDetails();
    }
  }, [isOpen, matchId]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      // 매치 상세 정보 가져오기
      const response = await fetch(`/api/match/details/${matchId}`);
      if (!response.ok) throw new Error('매치 정보를 가져오는데 실패했습니다.');

      const data = await response.json();
      setMatchDetails(data.match);
    } catch (error) {
      console.error('매치 정보 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    onAccept(matchId);
    onClose();
  };

  const handleReject = () => {
    onReject(matchId);
    onClose();
  };

  // 게임 타입 텍스트 변환 함수
  const getGameTypeText = (type: string | null): string => {
    if (!type) return '미지정';

    switch (type) {
      case 'THREE_BALL':
        return '3구';
      case 'FOUR_BALL':
        return '4구';
      case 'THREE_CUSHION':
        return '3쿠션';
      default:
        return type;
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '날짜 미지정';

    try {
      const date = new Date(dateString);
      return format(date, 'yyyy년 MM월 dd일 (eee) HH:mm', { locale: ko });
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error);
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="m-auto max-w-[90%] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            매치 신청 정보
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">로딩 중...</div>
          </div>
        ) : matchDetails ? (
          <div className="space-y-4">
            {/* 요청자 정보 */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={'/logo/billiard-ball.png'}
                  alt={matchDetails.requester?.name || '사용자'}
                />
                <AvatarFallback>
                  {matchDetails.requester?.name
                    ? matchDetails.requester.name.slice(0, 2)
                    : '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {matchDetails.requester?.name ||
                    matchDetails.player1_id ||
                    '이름 없음'}
                </h3>
                <p className="text-sm text-gray-500">
                  {matchDetails.requester?.level || '레벨 정보 없음'} ·{' '}
                  {matchDetails.requester?.matchCount || 0} 경기
                </p>
              </div>
            </div>

            <Separator />

            {/* 매치 상세 정보 */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">경기 일시</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(matchDetails.preferred_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">경기 장소</p>
                  <p className="text-sm text-gray-600">
                    {matchDetails.location || '장소 미지정'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-green-600"></div>
                <div>
                  <p className="text-sm font-medium">경기 종류</p>
                  <p className="text-sm text-gray-600">
                    {getGameTypeText(matchDetails.game_type)}
                  </p>
                </div>
              </div>

              {/* 요청자 메시지가 있는 경우 */}
              {matchDetails.message && (
                <div className="flex items-start space-x-2">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">메시지</p>
                    <p className="text-sm text-gray-600">
                      {matchDetails.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center text-red-500">
              매치 정보를 불러올 수 없습니다.
            </div>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between">
          <Button
            type="button"
            onClick={handleReject}
            disabled={loading}
            className="flex-1 bg-transparent text-black shadow-none"
          >
            거절하기
          </Button>
          <Button
            type="button"
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 bg-green-700"
          >
            수락하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
