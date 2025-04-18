'use client';

import { useState } from 'react';
import { ScheduleTabProps } from '@/types/(club)/club';

export function MobileCalendar({ schedules }: ScheduleTabProps) {
  // Get current date information
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const regularMeetings =
    schedules?.filter((schedule) => schedule.type === 'regular') || [];
  const tournaments =
    schedules?.filter((schedule) => schedule.type === 'tournament') || [];

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

  [...regularMeetings, ...tournaments].forEach((event) => {
    try {
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
  const selectedEvents = selectedDate
    ? [...regularMeetings, ...tournaments].filter((event) => {
        try {
          const eventDate = new Date(event.date);
          return formatDateString(eventDate) === formatDateString(selectedDate);
        } catch (error) {
          console.log(error);
          return false;
        }
      })
    : [];

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

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">다가오는 일정</h3>

      {/* Calendar UI */}
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
          <h4 className="text-lg font-medium">
            {year}년 {monthNames[month]}
          </h4>
          <button
            onClick={nextMonth}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
        <div className="mb-2 grid grid-cols-7 text-center">
          {weekdays.map((day, i) => (
            <div
              key={i}
              className={`text-sm font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <div
              key={i}
              className={`aspect-square cursor-pointer rounded-lg p-1 text-center ${
                day === null ? 'invisible' : ''
              } ${hasEvent(day) ? 'relative' : ''}`}
              onClick={() => day && setSelectedDate(new Date(year, month, day))}
            >
              <div
                className={`flex h-full w-full items-center justify-center rounded-full ${
                  selectedDate &&
                  selectedDate.getFullYear() === year &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getDate() === day
                    ? 'bg-blue-500 text-white'
                    : hasEvent(day)
                      ? 'hover:bg-blue-100'
                      : 'hover:bg-gray-100'
                }`}
              >
                {day}
              </div>
              {hasEvent(day) && (
                <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && selectedEvents.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="font-medium">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{' '}
            {selectedDate.getDate()}일 일정
          </h4>
          {selectedEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-lg border p-3 ${event.type === 'tournament' ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{event.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">{event.date}</p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>
              {event.type === 'tournament' && event.details && (
                <div className="mt-2 text-sm text-gray-600">
                  {event.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Regular Meetings */}
      <div className="mt-6 space-y-3">
        <h3 className="font-semibold">정기 모임</h3>
        {regularMeetings.length > 0 ? (
          regularMeetings.map((meeting) => (
            <div key={meeting.id} className="rounded-lg border p-3">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{meeting.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {meeting.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">{meeting.date}</p>
                  <p className="text-sm text-gray-600">{meeting.time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">예정된 정기 모임이 없습니다</p>
        )}
      </div>

      {/* Tournaments */}
      {tournaments.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">다음 대회 일정</h3>
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="rounded-lg border bg-blue-50 p-3"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{tournament.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {tournament.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">{tournament.date}</p>
                  <p className="text-sm text-gray-600">{tournament.time}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {tournament.details &&
                  tournament.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MobileCalendar;
