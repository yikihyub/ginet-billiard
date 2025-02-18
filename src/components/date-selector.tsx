'use client';

import React, { useState, useEffect, useRef } from 'react';

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
          day: date.toLocaleString('ko-KR', { weekday: 'short' }),
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
      todayRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
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

export default DateSelector;

// 'use client';

// import React, { useState, useEffect, useRef } from 'react';

// interface DateItem {
//   day: string;
//   date: number;
//   full: Date;
//   isToday: boolean;
// }

// const DateSelector = () => {
//   const todayRef = useRef<HTMLDivElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const [dates, setDates] = useState<DateItem[]>([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   useEffect(() => {
//     const generateDates = () => {
//       const result: DateItem[] = [];
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       for (let i = -30; i <= 30; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() + i);

//         const isToday =
//           date.getFullYear() === today.getFullYear() &&
//           date.getMonth() === today.getMonth() &&
//           date.getDate() === today.getDate();

//         result.push({
//           day: date.toLocaleString('ko-KR', { weekday: 'short' }),
//           date: date.getDate(),
//           full: date,
//           isToday,
//         });
//       }
//       setDates(result);

//       const todayIndex = result.findIndex((item) => item.isToday);
//       setActiveIndex(todayIndex);
//     };

//     generateDates();
//   }, []);

//   useEffect(() => {
//     if (todayRef.current) {
//       todayRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
//     }
//   }, [dates]);

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     setIsDragging(true);
//     setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
//     setScrollLeft(containerRef.current?.scrollLeft || 0);
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isDragging) return;
//     e.preventDefault();
//     const x = e.pageX - (containerRef.current?.offsetLeft || 0);
//     const walk = (x - startX) * 1;
//     if (containerRef.current) {
//       containerRef.current.scrollLeft = scrollLeft - walk;
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleDateClick = (index: number) => {
//     setActiveIndex(index);
//   };

//   return (
//     <div className="relative">
//       <div
//         ref={containerRef}
//         className="no-scrollbar flex cursor-grab select-none items-center overflow-x-auto px-3 py-2"
//         style={{
//           scrollBehavior: 'smooth',
//           WebkitOverflowScrolling: 'touch',
//           touchAction: 'pan-x',
//         }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseUp}
//         onMouseUp={handleMouseUp}
//       >
//         {dates.map((item, index) => (
//           <div
//             key={index}
//             ref={item.isToday ? todayRef : null}
//             className="group flex min-w-[68px] flex-col items-center px-1"
//             onClick={() => handleDateClick(index)}
//           >
//             <span
//               className={`mb-1 text-sm font-medium transition-colors ${
//                 activeIndex === index
//                   ? 'text-blue-600'
//                   : 'text-gray-500 group-hover:text-gray-700'
//               } `}
//             >
//               {item.day}
//             </span>
//             <div
//               className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
//                 activeIndex === index
//                   ? 'bg-blue-600 shadow-sm'
//                   : 'bg-gray-50 group-hover:bg-gray-100'
//               } ${item.isToday ? 'ring-1 ring-blue-200' : ''} `}
//             >
//               <span
//                 className={`text-base font-medium ${activeIndex === index ? 'text-white' : 'text-gray-700'} `}
//               >
//                 {item.date}
//               </span>
//               {item.isToday && (
//                 <div className="absolute -bottom-2 h-1 w-3 rounded-full bg-blue-600"></div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DateSelector;
