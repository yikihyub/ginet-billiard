'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar_custom';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BilliardSelect from '@/app/mobile/team-match/_components/select/billiard-select';
import { timeOptions } from '@/lib/utils';
import { ko } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { Label } from '@/components/ui/label';

import { ChevronLeft } from 'lucide-react';
import { Store } from '@/types/(match)';

export default function MatchRequest() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  // URL에서 파라미터 가져오기
  const opponentId = searchParams.get('opponent') || '';
  const opponentName = searchParams.get('name') || '상대방';

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [gameType, setGameType] = useState<string>('');
  const [location, setLocation] = useState<Store | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 로그인 확인
  useEffect(() => {
    if (userId) {
      toast({
        title: '로그인이 필요합니다',
        description: '매칭 신청을 위해 로그인해주세요.',
        variant: 'destructive',
      });
    }
  }, [session, router]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !gameType || !location) {
      toast({
        title: '입력 오류',
        description: '모든 필수 항목을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // 선택된 날짜와 시간을 결합
    const [hours, minutes] = selectedTime.split(':');
    const preferredDate = new Date(selectedDate);
    preferredDate.setHours(parseInt(hours), parseInt(minutes));

    setLoading(true);
    try {
      const response = await fetch('/api/match/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1_id: userId,
          player2_id: opponentId,
          preferred_date: preferredDate,
          game_type: gameType,
          location: location.name,
          message: message,
          request_status: '대기중',
        }),
      });

      if (!response.ok) {
        throw new Error('매칭 신청에 실패했습니다.');
      }

      toast({
        title: '전송 완료',
        description: '상대방에게 매칭 전송이 완료되었습니다.',
        variant: 'default',
      });

      // 매칭 목록 페이지나 이전 페이지로 이동
      router.push('/mobile/alert');
    } catch (error) {
      console.error('매칭 신청 오류:', error);
      toast({
        title: '신청 오류',
        description: '매칭 신청 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 이전 페이지로 돌아가기
  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center p-4">
          <div className="mr-2" onClick={() => router.back()}>
            <ChevronLeft className="text-black" />
          </div>
          <h1 className="text-lg font-semibold">
            {opponentName}님에게 매칭 신청
          </h1>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 p-4">
        <div className="mx-auto mb-4 max-w-md space-y-6">
          <div>
            <Label className="mb-2 block text-sm font-semibold text-gray-700">
              매칭 시간 <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="mt-2 h-14 border-none bg-gray-100 text-lg">
                <SelectValue placeholder="시간을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-semibold text-gray-700">
              게임 종류 <span className="text-red-500">*</span>
            </Label>
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger className="mt-2 h-14 border-none bg-gray-100 text-lg">
                <SelectValue placeholder="게임 종류를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THREE_BALL">3구</SelectItem>
                <SelectItem value="FOUR_BALL">4구</SelectItem>
                <SelectItem value="POCKET_BALL">포켓볼</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-semibold text-gray-700">
              매칭 장소 <span className="text-red-500">*</span>
            </Label>

            <BilliardSelect onSelect={setLocation} value={location} />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-semibold text-gray-700">
              메시지 (선택사항)
            </Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="상대방에게 전달할 메시지를 입력해주세요."
              className="mt-2 h-32 border-none bg-gray-100 text-lg"
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-semibold text-gray-700">
              매칭 날짜 <span className="text-red-500">*</span>
            </Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              className="mx-auto rounded-md border"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // 오늘 자정
                return date < today;
              }}
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex w-full items-center gap-4">
          <div className="w-full">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={loading}
              className="text-md h-11 w-full px-3 py-4"
            >
              취소
            </Button>
          </div>

          <div className="w-full">
            <Button
              onClick={handleSubmit}
              disabled={
                !selectedDate ||
                !selectedTime ||
                !gameType ||
                !location ||
                loading
              }
              className="text-md h-11 w-full bg-green-600 px-3 py-4 hover:bg-green-700"
            >
              {loading ? '신청 중...' : '매칭 신청하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
