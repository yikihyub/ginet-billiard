'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import {
  generateTimeSlots,
  isTimeSlotPassed,
  calculateEndTime,
} from '@/lib/utils';
import { gameTypes, durations } from '@/constants/(reserve)/reserve-time';
import { ReserveButtonProps } from '@/types/(reserve)';

const ReserveButton = ({ store }: ReserveButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [selectedType, setSelectedType] = useState('4구');

  const { data: session } = useSession();
  const phoneNum = session?.user.phonenum;

  // 운영 시간 내의 시간 슬롯 생성
  const timeSlots = useMemo(() => {
    if (!store?.open_time || !store?.close_time) return [];
    return generateTimeSlots(store.open_time, store.close_time);
  }, [store?.open_time, store?.close_time]);

  useEffect(() => {
    const validFutureSlot = timeSlots.find((slot) => !isTimeSlotPassed(slot));
    if (validFutureSlot) {
      setSelectedTime(validFutureSlot);
    }
  }, [timeSlots]);

  const handleReservation = async (formData: {
    customer_name: string;
    phone: string;
  }) => {
    try {
      const response = await fetch('/api/reserve/postreserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_id: store.id,
          table_number: selectedTable,
          customer_name: formData.customer_name,
          phone: formData.phone,
          reservation_date: new Date().toISOString().split('T')[0], // 오늘 날짜
          start_time: selectedTime,
          end_time: calculateEndTime(selectedTime!, selectedDuration),
        }),
      });

      if (!response.ok) {
        throw new Error('예약 처리 중 오류가 발생했습니다.');
      }

      alert('예약이 완료되었습니다!');
      setShowReservationForm(false);
      setIsExpanded(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '예약 처리 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <div className="h-full max-w-md shrink-0">
      <div className="sticky top-6 space-y-4 border bg-white p-6">
        {/* 기존 예약 정보 패널 */}
        <div>
          <div className="text-xl font-bold">
            12월 16일 월요일 {selectedTime}
          </div>
          <h2 className="mt-2 text-lg font-semibold">{store?.name}</h2>
          <div className="text-sm text-gray-600">
            {store?.address}
            <button className="ml-2 text-blue-500">지도 보기</button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span>👀 123</span>
            <span>❤️ 0</span>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">10,000원</span>
            <span className="text-gray-500">/ {selectedDuration}시간</span>
          </div>
          <p className="mt-1 text-sm text-red-500">
            매치 시작 10분 전 신청이 마감돼요
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full rounded-lg bg-green-600 py-3 font-bold text-white"
        >
          예약하기
        </button>

        {/* 확장되는 예약 폼 영역 */}
        {isExpanded && (
          <div className="mt-4 space-y-6 transition-all duration-300">
            {/* 시간 선택 */}
            <div className="rounded-lg border bg-white p-4">
              <h3 className="mb-3 font-bold">시간 선택</h3>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((time) => {
                  const isPassed = isTimeSlotPassed(time);
                  return (
                    <button
                      key={time}
                      onClick={() => !isPassed && setSelectedTime(time)}
                      disabled={isPassed}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isPassed
                          ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                          : selectedTime === time
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                      {isPassed && '(마감)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 구종 선택 */}
            <div className="rounded-lg border bg-white p-4">
              <h3 className="mb-3 font-bold">구종 선택</h3>
              <div className="flex gap-2">
                {gameTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 이용 시간 선택 */}
            <div className="rounded-lg border bg-white p-4">
              <h3 className="mb-3 font-bold">이용 시간</h3>
              <div className="grid grid-cols-2 gap-2">
                {durations.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedDuration(value)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      selectedDuration === value
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 테이블 선택 */}
            <div className="rounded-lg border bg-white p-4">
              <h3 className="mb-3 font-bold">테이블 선택</h3>
              <div className="grid grid-cols-2 gap-2">
                {Array.from(
                  { length: store.has_table ?? 0 },
                  (_, i) => i + 1
                ).map((table) => (
                  <button
                    key={table}
                    onClick={() => setSelectedTable(table)}
                    className={`rounded-lg p-3 text-sm font-medium transition-colors ${
                      selectedTable === table
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {table}번 테이블
                  </button>
                ))}
              </div>
            </div>

            {/* 예약 요약 정보 */}
            <div className="rounded-lg border bg-white p-4">
              <h3 className="mb-3 font-bold">예약 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">선택 시간</span>
                  <span className="font-medium">
                    {selectedTime || '시간을 선택해주세요'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">구종</span>
                  <span className="font-medium">{selectedType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">이용 시간</span>
                  <span className="font-medium">{selectedDuration}시간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">테이블</span>
                  <span className="font-medium">
                    {selectedTable ? `${selectedTable}번` : '선택해주세요'}
                  </span>
                </div>
              </div>
            </div>

            <button
              disabled={!selectedTime || !selectedTable}
              onClick={() => setShowReservationForm(true)}
              className={`w-full rounded-lg py-3 font-bold text-white ${
                !selectedTime || !selectedTable
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-green-600'
              }`}
            >
              예약하기
            </button>
          </div>
        )}
      </div>
      {/* 예약 폼 모달 */}
      <Dialog open={showReservationForm} onOpenChange={setShowReservationForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>예약 정보 입력</DialogTitle>
          </DialogHeader>
          <h2 className="mb-4 text-xl font-bold">예약 정보 입력</h2>

          <div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">예약 시간</span>
              <span>{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">구종</span>
              <span>{selectedType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">이용 시간</span>
              <span>{selectedDuration}시간</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">테이블</span>
              <span>{selectedTable}번</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleReservation({
                customer_name: formData.get('customer_name') as string,
                phone: formData.get('phone') as string,
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                예약자 성함
              </label>
              <input
                type="text"
                name="customer_name"
                required
                className="w-full rounded-md border p-2"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">연락처</label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full rounded-md border p-2"
                placeholder="010-0000-0000"
                pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                value={phoneNum}
                readOnly
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowReservationForm(false)}
                className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                예약 완료
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReserveButton;
