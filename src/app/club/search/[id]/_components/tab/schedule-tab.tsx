'use client';

import { ScheduleTabProps } from '@/types/(club)/club';
import DesktopCalendar from '../calendar/desktop-calendar';
import MobileCalendar from '../calendar/mobile-calendar';

export function ScheduleTab({ schedules }: ScheduleTabProps) {
  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden">
        <MobileCalendar schedules={schedules} />
      </div>

      {/* 데스크톱 */}
      <div className="hidden md:block">
        <DesktopCalendar schedules={schedules} />
      </div>
    </>
  );
}

export default ScheduleTab;
