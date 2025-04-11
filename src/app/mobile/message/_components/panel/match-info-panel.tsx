'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Edit2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MatchDetail } from '@/app/mobile/match/_types';
import { MatchInfoPanelProps } from '@/app/mobile/message/_types';

export default function MatchInfoPanel({
  matchId,
  userId,

  onUpdateSuccess,
}: MatchInfoPanelProps) {
  const [matchDetails, setMatchDetails] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [updateReason, setUpdateReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const { toast } = useToast();

  // 컴포넌트 마운트시 매치 정보 가져오기
  React.useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  // 매치 정보 가져오기
  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/match/details/${matchId}`);
      if (!response.ok) throw new Error('매치 정보를 불러올 수 없습니다.');

      const data = await response.json();
      setMatchDetails(data.match);
    } catch (error) {
      console.error('매치 정보 로딩 오류:', error);
      toast({
        title: '오류 발생',
        description: '매치 정보를 불러올 수 없습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 일정 변경 요청 처리
  const handleUpdateRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/match/request-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          userId,
          reason: updateReason,
        }),
      });

      if (!response.ok) throw new Error('일정 변경 요청에 실패했습니다.');

      toast({
        title: '일정 변경 요청 완료',
        description: '상대방의 응답을 기다려주세요.',
      });

      setShowUpdateDialog(false);
      setUpdateReason('');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error('일정 변경 요청 오류:', error);
      toast({
        title: '오류 발생',
        description: '일정 변경 요청 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 매치 취소 요청 처리
  const handleCancelRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/match/request-cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          userId,
          reason: cancelReason,
        }),
      });

      if (!response.ok) throw new Error('매치 취소 요청에 실패했습니다.');

      toast({
        title: '매치 취소 요청 완료',
        description: '상대방의 응답을 기다려주세요.',
      });

      setShowCancelDialog(false);
      setCancelReason('');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error('매치 취소 요청 오류:', error);
      toast({
        title: '오류 발생',
        description: '매치 취소 요청 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '미정';

    try {
      const date = new Date(dateString);
      return format(date, 'yyyy년 MM월 dd일 (eee) HH:mm', { locale: ko });
    } catch (error) {
      console.log(error);
      return '날짜 오류';
    }
  };

  // 게임 타입 표시 함수
  const getGameTypeText = (type: string | null): string => {
    if (!type) return '미정';

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

  if (loading && !matchDetails) {
    return (
      <div className="mb-4 bg-gray-50 p-3 text-center text-sm text-gray-500">
        매치 정보 로딩 중...
      </div>
    );
  }

  if (!matchDetails) {
    return (
      <div className="mb-4 bg-red-50 p-3 text-center text-sm text-red-500">
        매치 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <>
      <div
        className={`mb-4 rounded-lg bg-gray-50 p-3 shadow-sm ${isExpanded ? 'pb-4' : ''}`}
      >
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="text-sm font-semibold">매치 정보</div>
          <div className="text-xs text-gray-500">
            {isExpanded ? '접기' : '펼치기'}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            <div className="flex items-start space-x-2">
              <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs font-medium text-gray-600">경기 일시</p>
                <p className="text-sm">
                  {formatDate(matchDetails.preferred_date)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs font-medium text-gray-600">경기 장소</p>
                <p className="text-sm">{matchDetails.location || '미정'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-green-600"></div>
              <div>
                <p className="text-xs font-medium text-gray-600">경기 종류</p>
                <p className="text-sm">
                  {getGameTypeText(matchDetails.game_type)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-end space-x-2">
              <Button
                variant="outline"
                className="h-8 border-gray-300 bg-white text-xs"
                size="sm"
                onClick={() => setShowUpdateDialog(true)}
              >
                <Edit2 className="mr-1 h-3 w-3" />
                일정 변경
              </Button>
              <Button
                variant="outline"
                className="h-8 border-red-200 bg-white text-xs text-red-500"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
              >
                <AlertCircle className="mr-1 h-3 w-3" />
                매치 취소
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 일정 변경 모달 */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>일정 변경 요청</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              일정 변경 사유를 입력해주세요. 상대방에게 알림이 전송됩니다.
            </p>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              rows={3}
              placeholder="일정 변경 사유 (예: 갑작스러운 일정 변경으로 인해 시간 조정이 필요합니다.)"
              value={updateReason}
              onChange={(e) => setUpdateReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
            >
              취소
            </Button>
            <Button
              disabled={!updateReason.trim() || loading}
              onClick={handleUpdateRequest}
            >
              {loading ? '처리 중...' : '변경 요청'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 매치 취소 모달 */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>매치 취소 요청</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              매치 취소 사유를 입력해주세요. 상대방에게 알림이 전송됩니다.
            </p>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              rows={3}
              placeholder="취소 사유 (예: 개인 사정으로 인해 경기에 참가할 수 없게 되었습니다.)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={!cancelReason.trim() || loading}
              onClick={handleCancelRequest}
            >
              {loading ? '처리 중...' : '매치 취소'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
