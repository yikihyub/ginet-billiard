'use client';

import { useState } from 'react';
import { ScheduleTabProps } from '@/types/(club)/club';

export function DesktopCalendar({ schedules }: ScheduleTabProps) {
  // State for calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const regularMeetings =
    schedules?.filter((schedule) => schedule.type === 'regular') || [];
  const tournaments =
    schedules?.filter((schedule) => schedule.type === 'tournament') || [];
  const allEvents = [...regularMeetings, ...tournaments];

  // Calendar navigation
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const today = new Date();

  // Helper function to get all days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Get calendar grid data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Create calendar days array
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Empty cells for days before the 1st of month
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Format date string for comparison
  const formatDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Map events to dates for highlighting
  const eventDates = new Map();

  allEvents.forEach((event) => {
    try {
      // Handle different date formats (assuming event.date is in a recognizable format)
      const eventDate = new Date(event.date);
      if (!isNaN(eventDate.getTime())) {
        const dateKey = formatDateString(eventDate);
        if (!eventDates.has(dateKey)) {
          eventDates.set(dateKey, []);
        }
        eventDates.get(dateKey).push(event);
      }
    } catch (error) {
      console.log(error);
      console.error('Error parsing date:', event.date);
    }
  });

  // Get events for selected date
  // const selectedEvents = selectedDate
  //   ? allEvents.filter((event) => {
  //       try {
  //         const eventDate = new Date(event.date);
  //         return formatDateString(eventDate) === formatDateString(selectedDate);
  //       } catch (error) {
  //         console.log(error);
  //         return false;
  //       }
  //     })
  //   : [];

  // Months in Korean
  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  // Days of week in Korean
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // Check if a date has events
  const hasEvent = (day: number | null) => {
    if (day === null) return false;
    const dateKey = formatDateString(new Date(year, month, day));
    return eventDates.has(dateKey);
  };

  // Check if a date is today
  const isToday = (day: number | null) => {
    if (day === null) return false;
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  // Get event type for color coding
  const getEventType = (day: number | null) => {
    if (day === null) return null;

    const dateKey = formatDateString(new Date(year, month, day));
    if (!eventDates.has(dateKey)) return null;

    const events = eventDates.get(dateKey);
    if (events.some((event: any) => event.type === 'tournament')) {
      return 'tournament';
    }
    return 'regular';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">다가오는 일정</h3>

      {/* Calendar UI */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left side - Calendar */}
        <div className="col-span-3 rounded-lg border p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <h4 className="text-2xl font-semibold">
              {year}년 {monthNames[month]}
            </h4>
            <button
              onClick={nextMonth}
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="mb-4 grid grid-cols-7 text-center">
            {weekdays.map((day, i) => (
              <div
                key={i}
                className={`py-2 text-sm font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const eventType = getEventType(day);

              return (
                <div
                  key={i}
                  className={`relative aspect-square cursor-pointer p-1 ${
                    day === null ? 'invisible' : ''
                  }`}
                  onClick={() =>
                    day && setSelectedDate(new Date(year, month, day))
                  }
                >
                  <div
                    className={`flex h-full w-full flex-col items-start justify-start rounded-md p-2 transition-colors ${
                      selectedDate &&
                      selectedDate.getFullYear() === year &&
                      selectedDate.getMonth() === month &&
                      selectedDate.getDate() === day
                        ? 'bg-blue-500 text-white shadow-md'
                        : isToday(day)
                          ? 'bg-blue-100 text-blue-800'
                          : hasEvent(day)
                            ? 'hover:bg-blue-50'
                            : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        isToday(day) &&
                        !(
                          selectedDate &&
                          selectedDate.getFullYear() === year &&
                          selectedDate.getMonth() === month &&
                          selectedDate.getDate() === day
                        )
                          ? 'bg-blue-500 text-white'
                          : ''
                      }`}
                    >
                      {day}
                    </span>

                    {hasEvent(day) && (
                      <div className="mt-1 flex gap-1">
                        {eventType === 'tournament' && (
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        )}
                        {eventType === 'regular' && (
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="mt-6 flex items-center justify-end gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>정기 모임</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span>대회 일정</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="grid grid-cols-2 gap-6">
        {/* Regular Meetings */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">정기 모임</h3>
          {regularMeetings.length > 0 ? (
            <div className="space-y-3">
              {regularMeetings.slice(0, 3).map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-lg border border-l-4 border-l-blue-500 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{meeting.title}</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {meeting.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">
                        {meeting.date}
                      </p>
                      <p className="text-sm text-gray-600">{meeting.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              {regularMeetings.length > 3 && (
                <p className="text-right text-sm text-blue-600">
                  + {regularMeetings.length - 3}개 더보기
                </p>
              )}
            </div>
          ) : (
            <p className="py-4 text-gray-500">예정된 정기 모임이 없습니다</p>
          )}
        </div>

        {/* Tournaments */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">다음 대회 일정</h3>
          {tournaments.length > 0 ? (
            <div className="space-y-3">
              {tournaments.slice(0, 3).map((tournament) => (
                <div
                  key={tournament.id}
                  className="rounded-lg border border-l-4 border-l-red-500 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{tournament.title}</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {tournament.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">
                        {tournament.date}
                      </p>
                      <p className="text-sm text-gray-600">{tournament.time}</p>
                    </div>
                  </div>
                  {tournament.details && tournament.details.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>{tournament.details[0]}</p>
                      {tournament.details.length > 1 && (
                        <p className="text-xs text-gray-500">
                          +{tournament.details.length - 1}개 더보기
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {tournaments.length > 3 && (
                <p className="text-right text-sm text-red-600">
                  + {tournaments.length - 3}개 더보기
                </p>
              )}
            </div>
          ) : (
            <p className="py-4 text-gray-500">예정된 대회가 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DesktopCalendar;
