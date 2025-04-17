'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DateItem {
  day: string;
  date: number;
  full: Date;
  isToday: boolean;
}

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const todayRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [dates, setDates] = useState<DateItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const generateDates = () => {
      const result: DateItem[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = -30; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const isToday =
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();

        result.push({
          day: date.toLocaleString('ko-KR', { weekday: 'short' }),
          date: date.getDate(),
          full: date,
          isToday,
        });
      }
      setDates(result);

      // 선택된 날짜에 맞는 인덱스 찾기
      const selectedIndex = result.findIndex(
        (item) =>
          item.full.getFullYear() === selectedDate.getFullYear() &&
          item.full.getMonth() === selectedDate.getMonth() &&
          item.full.getDate() === selectedDate.getDate()
      );

      setActiveIndex(
        selectedIndex !== -1
          ? selectedIndex
          : result.findIndex((item) => item.isToday)
      );
    };

    generateDates();
  }, [selectedDate]);

  // useEffect(() => {
  //   if (todayRef.current) {
  //     // 오늘 날짜로 스크롤
  //     todayRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  //   }
  // }, [dates]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1; // 이동 속도 조정
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDateClick = (index: number) => {
    setActiveIndex(index); // 활성 상태 업데이트
    onDateChange(dates[index].full); // 부모 컴포넌트에 날짜 변경 알림
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="no-scrollbar flex cursor-grab items-center overflow-x-auto px-4 py-2"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        {dates.map((item, index) => (
          <div
            key={index}
            ref={item.isToday ? todayRef : null}
            className="flex min-w-[80px] flex-col items-center px-1"
            style={{ scrollSnapAlign: 'center' }}
            onClick={() => handleDateClick(index)}
          >
            <span
              className={`flex items-center justify-center p-2 ${
                activeIndex === index ? 'font-bold text-blue-500' : ''
              }`}
            >
              {item.day}
            </span>
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full p-4 ${
                activeIndex === index
                  ? 'bg-[#EFF2FA] font-bold text-blue-500'
                  : ''
              }`}
            >
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 기본 props 설정
DateSelector.defaultProps = {
  selectedDate: new Date(),
  onDateChange: () => {},
};

export default DateSelector;
