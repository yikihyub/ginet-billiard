'use client';

import { InfoTab } from '../tab/info-tab';
import { ScheduleTab } from '../tab/schedule-tab';
import { GalleryTab } from '../tab/gallery-tab';
import { MembersTab } from '../tab/member-tab';

import { ClubTabContentProps } from '@/types/(club)/club';

export default function ClubTabContent({
  activeTab,
  clubData,
}: ClubTabContentProps) {
  return (
    <div className="bg-white p-4 shadow-sm">
      {activeTab === 'info' && <InfoTab clubData={clubData} />}
      {activeTab === 'schedule' && (
        <ScheduleTab schedules={clubData.schedules} />
      )}
      {activeTab === 'gallery' && <GalleryTab gallery={clubData.gallery} />}
      {activeTab === 'members' && (
        <MembersTab
          staffMembers={clubData.staff}
          members={clubData.members}
          memberCount={clubData.memberCount}
          memberLimit={clubData.memberLimit}
        />
      )}
    </div>
  );
}
