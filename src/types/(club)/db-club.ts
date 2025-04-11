// /types/club.ts

// 수정된 DB 모델과 일치하는 기본 타입들
export interface ClubModel {
  club_id: number;
  club_name: string;
  club_description: string | null;
  club_location: string;
  club_now_members: number | null;
  club_max_members: number | null;
  club_regular_day: string | null;
  club_founding_date: Date | null;
  club_rules: string[];
  club_place_name: string | null;
  club_place_address: string | null;
  club_contact_phone: string | null;
  club_contact_email: string | null;
  club_created_at: Date;
  club_updated_at: Date;
  club_owner_id: string;
  club_type: string | null;
}

export interface ClubAnnouncementModel {
  club_announcement_id: number;
  club_id: number;
  title: string;
  content: string;
  created_at: Date;
  created_by: string;
}

export interface ClubGalleryModel {
  club_gallery_id: number;
  club_id: number;
  club_gallery_image_url: string;
  club_gallery_description: string | null;
  uploaded_at: Date;
  uploaded_by: string;
}

export interface ClubMemberModel {
  club_id: number;
  user_id: string;
  is_staff: boolean | null;
  staff_role: string | null;
  joined_at: Date;
  member_permission_level: string | null;
}

export interface ClubScheduleModel {
  club_schedule_id: number;
  club_id: number;
  club_schedule_title: string;
  club_schedule_description: string | null;
  club_schedule_location: string | null;
  club_schedule_start_time: Date;
  club_schedule_end_time: Date | null;
  club_schedule_is_competition: boolean | null;
}

export interface ClubJoinRequestModel {
  request_id: number;
  club_id: number;
  user_id: string;
  status: string | null;
  requested_at: Date;
}

export interface ClubScheduleParticipantModel {
  club_schedule_id: number;
  user_id: string;
  status: string | null;
}

export interface ClubTagModel {
  tag_id: number;
  tag_name: string;
}

// User 관련
export interface UserModel {
  mb_id: string;
  mb_name: string;
  mb_profile_image: string | null;
  // 필요한 다른 사용자 필드 추가
}

// 프론트엔드 표시용 통합 인터페이스
export interface ClubData {
  id: number;
  name: string;
  bannerImage?: string;
  location: string;
  memberCount: number;
  memberLimit: number;
  meetingSchedule: string;
  establishedYear: string;
  rating?: number;
  description: string;
  isAdmin: boolean;
  tags: {
    id: number;
    name: string;
  }[];
  rules: string[];
  venue: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
  schedules: {
    id: number;
    type: string; // 'regular' | 'competition'
    title: string;
    location: string;
    date: string;
    time: string;
    details?: string[];
    endTime?: string;
  }[];
  gallery: {
    images: {
      id: number;
      url: string | null;
      alt: string;
    }[];
  };
  staff: {
    id: number;
    userId: string;
    name: string;
    role: string;
    since: string;
    profileImage: string | null;
  }[];
  members: {
    id: number;
    userId: string;
    name: string;
    profileImage: string | null;
    joinDate: string;
  }[];
  notices: {
    id: number;
    title: string;
    content: string;
    date: string;
  }[];
}

// DB 응답을 프론트엔드 형식으로 변환하는 유틸리티 타입
export interface DBResponse {
  club: ClubModel;
  announcements: ClubAnnouncementModel[];
  gallery: ClubGalleryModel[];
  members: ClubMemberModel[];
  schedules: ClubScheduleModel[];
  tags: ClubTagModel[];
  users: { [userId: string]: UserModel }; // 관련 사용자 데이터
}

// Component Props Interfaces
export interface ClubHeaderProps {
  clubData: Pick<ClubData, 'bannerImage' | 'name'>;
}

export interface ClubInfoProps {
  clubData: Pick<
    ClubData,
    | 'name'
    | 'location'
    | 'memberCount'
    | 'memberLimit'
    | 'meetingSchedule'
    | 'establishedYear'
    | 'rating'
    // | 'tags'
  >;
}

export interface ClubTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface ClubTabContentProps {
  activeTab: string;
  clubData: ClubData;
}

export interface InfoTabProps {
  clubData: Pick<ClubData, 'description' | 'rules' | 'venue' | 'contact'>;
}

export interface ScheduleTabProps {
  schedules: ClubData['schedules'];
}

export interface GalleryTabProps {
  gallery: ClubData['gallery'];
}

export interface MembersTabProps {
  staffMembers: ClubData['staff'];
  members: ClubData['members'];
  memberCount: number;
  memberLimit: number;
}

export interface ClubNoticesProps {
  notices: ClubData['notices'];
}

export interface ClubCommunicationButtonsProps {
  id: number;
}

export interface ClubJoinButtonProps {
  clubId: number;
}
