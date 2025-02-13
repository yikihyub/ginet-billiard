import React from 'react';

interface TimeSlot {
  yoil: string;
  time: string;
  originalPrice: number;
}

interface TimeTableProps {
  dayTimes: TimeSlot[];
  weekendTimes: TimeSlot[];
}

export function TimeTable({ dayTimes, weekendTimes }: TimeTableProps) {
  const TableSection = ({
    times,
    title,
  }: {
    times: TimeSlot[];
    title: string;
  }) => (
    <>
      <h3 className="mb-2 text-sm text-gray-500">{title}</h3>
      <div className="mb-4 w-full overflow-hidden rounded-lg border">
        <div className="grid grid-cols-12 bg-gray-50 text-sm">
          <div className="col-span-2 p-3 text-gray-600">요일</div>
          <div className="col-span-3 p-3 text-gray-600">시간</div>
          <div className="col-span-7 p-3 text-gray-600">요금</div>
        </div>

        <div className="divide-y">
          {times.map((timeSlot, index) => (
            <div
              key={index}
              className="grid grid-cols-12 text-sm transition-colors hover:bg-gray-50"
            >
              <div className="col-span-2 p-3">{timeSlot.yoil}</div>
              <div className="col-span-3 p-3">{timeSlot.time}</div>
              <div className="col-span-7 p-3">
                {timeSlot.originalPrice.toLocaleString()}원 / 10분당
                <span className="ml-1 text-gray-500">기본요금 5,000원</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="border-b p-4">
      <h2 className="mb-4 text-lg font-semibold">당구장 운영시간</h2>
      <TableSection times={dayTimes} title="평일" />
      <TableSection times={weekendTimes} title="주말" />
    </div>
  );
}
