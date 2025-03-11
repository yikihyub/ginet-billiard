export type ClubType = '3구' | '4구' | '포켓볼' | '종합' | '';

export type FormStep =
  | 'agreement'
  | 'type'
  | 'basic'
  | 'details'
  | 'rules'
  | 'location'
  | 'contact'
  | 'review';

export interface ClubInfo {
  type: ClubType;
  name: string;
  description: string;
  location: string;
  maxMembers: number;
  regularDay: string;
  tags: string[];
  rules: string[];
  placeName: string;
  placeAddress: string;
  contactPhone: string;
  contactEmail: string;
}

// /types/club.ts

export interface Tag {
  id: number;
  name: string;
  type: 'activity' | 'feature';
}

export interface Venue {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Contact {
  phone: string;
  email: string;
}

export interface Schedule {
  id: number;
  type: 'regular' | 'tournament';
  title: string;
  location: string;
  date: string;
  time: string;
  details?: string[];
}

export interface GalleryImage {
  id: number;
  url: string | null;
  alt: string;
}

export interface Gallery {
  images: GalleryImage[];
}

export interface Member {
  id: number;
  name: string;
  profileImage: string | null;
  joinDate: string;
}

export interface StaffMember extends Member {
  role: string;
  since: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
}

export interface FrontClubData {
  id: string | number;
  name: string;
  bannerImage: string;
  location: string;
  memberCount: number;
  memberLimit: number;
  meetingSchedule: string;
  establishedYear: string;
  rating: number;
  description: string;
  tags: Tag[];
  rules: string[];
  venue: Venue;
  contact: Contact;
  schedules: Schedule[];
  gallery: Gallery;
  staff: StaffMember[];
  members: Member[];
  notices: Notice[];
}

// Component Props Interfaces

export interface ClubHeaderProps {
  clubData: Pick<FrontClubData, 'bannerImage' | 'name'>;
}

export interface ClubInfoProps {
  clubData: Pick<
    FrontClubData,
    | 'name'
    | 'location'
    | 'memberCount'
    | 'memberLimit'
    | 'meetingSchedule'
    | 'establishedYear'
    | 'rating'
    | 'tags'
  >;
  clubId: string;
  isAdmin: boolean;
}

export interface ClubTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface ClubTabContentProps {
  activeTab: string;
  clubData: FrontClubData;
}

export interface InfoTabProps {
  clubData: Pick<FrontClubData, 'description' | 'rules' | 'venue' | 'contact'>;
}

export interface ScheduleTabProps {
  schedules: Schedule[];
}

export interface GalleryTabProps {
  gallery: Gallery;
}

export interface MembersTabProps {
  staffMembers: StaffMember[];
  members: Member[];
  memberCount: number;
  memberLimit: number;
}

export interface ClubNoticesProps {
  notices: Notice[];
}

export interface ClubCommunicationButtonsProps {
  id: string | number;
}

// export interface ClubJoinButtonProps {
//   // No props required for now, but can be extended
// }
