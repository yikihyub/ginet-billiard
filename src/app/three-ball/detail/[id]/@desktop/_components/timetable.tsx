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
      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
      <div className="w-full border rounded-lg overflow-hidden mb-4">
        <div className="grid grid-cols-12 bg-gray-50 text-sm">
          <div className="col-span-2 p-3 text-gray-600">요일</div>
          <div className="col-span-3 p-3 text-gray-600">시간</div>
          <div className="col-span-7 p-3 text-gray-600">요금</div>
        </div>

        <div className="divide-y">
          {times.map((timeSlot, index) => (
            <div
              key={index}
              className="grid grid-cols-12 text-sm hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-2 p-3">{timeSlot.yoil}</div>
              <div className="col-span-3 p-3">{timeSlot.time}</div>
              <div className="col-span-7 p-3">
                {timeSlot.originalPrice.toLocaleString()}원 / 10분당
                <span className="text-gray-500 ml-1">기본요금 5,000원</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold mb-4">당구장 운영시간</h2>
      <TableSection times={dayTimes} title="평일" />
      <TableSection times={weekendTimes} title="주말" />
    </div>
  );
}
