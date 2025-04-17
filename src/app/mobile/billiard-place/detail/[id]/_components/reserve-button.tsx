'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Store } from '@/types/(reserve)';

interface ReserveButtonProps {
  store: Store;
}

export default function ReserveButton({ store }: ReserveButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [selectedType, setSelectedType] = useState('4구');

  console.log(showReservationForm);

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const slots = [];
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);

    const current = new Date(start);
    while (current <= end) {
      slots.push(
        current.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  // 현재 시간이 지났는지 체크하는 함수
  const isTimeSlotPassed = (timeSlot: string) => {
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0);

    return slotDate < now;
  };

  // const calculateEndTime = (startTime: string, durationHours: number) => {
  //   const [hours, minutes] = startTime.split(':').map(Number);
  //   const endDate = new Date();
  //   endDate.setHours(hours + durationHours, minutes);
  //   return endDate.toLocaleTimeString('ko-KR', {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: false,
  //   });
  // };

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

  // const handleReservation = async (formData: {
  //   customer_name: string;
  //   phone: string;
  // }) => {
  //   try {
  //     const response = await fetch('/api/reserve/postreserve', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         store_id: store.id,
  //         table_number: selectedTable,
  //         customer_name: formData.customer_name,
  //         phone: formData.phone,
  //         reservation_date: new Date().toISOString().split('T')[0], // 오늘 날짜
  //         start_time: selectedTime,
  //         end_time: calculateEndTime(selectedTime!, selectedDuration),
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('예약 처리 중 오류가 발생했습니다.');
  //     }

  //     alert('예약이 완료되었습니다!');
  //     setShowReservationForm(false);
  //   } catch (error) {
  //     alert(
  //       error instanceof Error
  //         ? error.message
  //         : '예약 처리 중 오류가 발생했습니다.'
  //     );
  //   }
  // };

  const gameTypes = ['3구', '4구', '포켓볼'];

  const durations = [
    { value: 1, label: '1시간' },
    { value: 2, label: '2시간' },
    { value: 3, label: '3시간' },
    { value: 4, label: '4시간' },
  ];

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger className="fixed bottom-0 w-full bg-white p-4 shadow-lg">
          <div
            onClick={() => setIsOpen(true)}
            className="w-full bg-green-500 py-3 font-bold text-white"
          >
            예약하기
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] p-4">
          <DrawerHeader>
            <DrawerTitle className="text-center"></DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 py-6">
            <Accordion type="single" collapsible className="space-y-4">
              {/* 시간 선택 */}
              <AccordionItem value="time" className="rounded-lg border">
                <AccordionTrigger className="px-4">
                  <div className="flex w-full justify-between">
                    <span className="font-bold">시간 선택</span>
                    <span className="text-gray-500">
                      {selectedTime || '선택해주세요'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
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
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time}
                          {isPassed && '(마감)'}
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 구종 선택 */}
              <AccordionItem value="type" className="rounded-lg border">
                <AccordionTrigger className="px-4">
                  <div className="flex w-full justify-between">
                    <span className="font-bold">구종 선택</span>
                    <span className="text-gray-500">{selectedType}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex gap-2">
                    {gameTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                          selectedType === type
                            ? 'bg-green-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 이용 시간 */}
              <AccordionItem value="duration" className="rounded-lg border">
                <AccordionTrigger className="px-4">
                  <div className="flex w-full justify-between">
                    <span className="font-bold">이용 시간</span>
                    <span className="text-gray-500">
                      {selectedDuration}시간
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {durations.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setSelectedDuration(value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          selectedDuration === value
                            ? 'bg-green-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 테이블 선택 */}
              <AccordionItem value="table" className="rounded-lg border">
                <AccordionTrigger className="px-4">
                  <div className="flex w-full justify-between">
                    <span className="font-bold">테이블 선택</span>
                    <span className="text-gray-500">
                      {selectedTable ? `${selectedTable}번` : '선택해주세요'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((table) => (
                      <button
                        key={table}
                        onClick={() => setSelectedTable(table)}
                        className={`rounded-lg p-3 text-sm font-medium transition-colors ${
                          selectedTable === table
                            ? 'bg-green-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {table}번 테이블
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* 예약 정보 요약 */}
            <div className="mt-6 space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">선택한 시간</span>
                <span>{selectedTime || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">구종</span>
                <span>{selectedType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">이용 시간</span>
                <span>{selectedDuration}시간</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">테이블</span>
                <span>{selectedTable ? `${selectedTable}번` : '-'}</span>
              </div>
            </div>

            <button
              disabled={!selectedTime || !selectedTable}
              onClick={() => setShowReservationForm(true)}
              className={`mt-4 w-full rounded-lg py-4 font-bold ${
                !selectedTime || !selectedTable
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-green-500 text-white'
              }`}
            >
              예약하기
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
