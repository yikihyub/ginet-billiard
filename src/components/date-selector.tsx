"use client";

import React, { useState, useEffect, useRef } from "react";

interface DateItem {
  day: string;
  date: number;
  full: Date;
  isToday: boolean;
}

const DateSelector = () => {
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
          day: date.toLocaleString("ko-KR", { weekday: "short" }),
          date: date.getDate(),
          full: date,
          isToday,
        });
      }
      setDates(result);

      const todayIndex = result.findIndex((item) => item.isToday);
      setActiveIndex(todayIndex);
    };

    generateDates();
  }, []);

  useEffect(() => {
    if (todayRef.current) {
      // 오늘 날짜로 스크롤
      todayRef.current.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  }, [dates]);

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
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex items-center overflow-x-auto no-scrollbar px-4 py-2 cursor-grab"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
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
            className="flex flex-col items-center min-w-[80px] px-1"
            style={{ scrollSnapAlign: "center" }}
            onClick={() => handleDateClick(index)}
          >
            <span
              className={`p-2 flex items-center justify-center ${
                activeIndex === index ? "text-blue-500 font-bold" : ""
              }`}
            >
              {item.day}
            </span>
            <span
              className={`w-10 h-10 p-4 rounded-full flex items-center justify-center ${
                activeIndex === index
                  ? "bg-[#EFF2FA] text-blue-500 font-bold"
                  : ""
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

export default DateSelector;
