import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { timeOptions } from '@/lib/utils';
import { ko } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface MatchRequestProps {
  userId: string;
  opponentId: string;
  opponentName: string;
  onRequestSent?: () => void;
}

export default function MatchRequest({
  userId,
  opponentId,
  opponentName,
  onRequestSent,
}: MatchRequestProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [gameType, setGameType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !gameType || !location) {
      alert('모든 필수 항목을 입력해주세요.');
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
          location: location,
          message: message,
          request_status: '대기중',
        }),
      });

      if (!response.ok) {
        throw new Error('매칭 신청에 실패했습니다.');
      }

      setIsOpen(false);
      if (onRequestSent) {
        onRequestSent();
      }
      toast({
        title: '전송 완료',
        description: '상대방에게 매칭 전송이 완료되었습니다.',
        variant: 'default',
      });
    } catch (error) {
      console.error('매칭 신청 오류:', error);
      alert('매칭 신청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-sm hover:bg-blue-700">
          매칭신청
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[425px] overflow-y-auto rounded-lg p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>{opponentName}님에게 매칭 신청</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              매칭 날짜 *
            </label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              매칭 시간 *
            </label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
              게임 종류 *
            </label>
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger>
                <SelectValue placeholder="게임 종류를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THREE_BALL">3구</SelectItem>
                <SelectItem value="FOUR_BALL">4구</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              매칭 장소 *
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="매칭 장소를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="서울 남녀나눔 당구장">
                  서울 남녀나눔 당구장
                </SelectItem>
                <SelectItem value="서울 두꺼비 당구장">
                  서울 두꺼비 당구장
                </SelectItem>
                <SelectItem value="당진 에이스 당구장">
                  당진 에이스 당구장
                </SelectItem>
                <SelectItem value="당진 노블레스 당구장">
                  당진 노블레스 당구장
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              메시지 (선택사항)
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="상대방에게 전달할 메시지를 입력해주세요."
              className="h-32"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !selectedDate ||
                !selectedTime ||
                !gameType ||
                !location ||
                loading
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? '신청 중...' : '매칭 신청하기'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
