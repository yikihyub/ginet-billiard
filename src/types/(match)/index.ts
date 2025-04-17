export type GameType = '3ball' | '4ball' | 'pocket';
export type PlayTime = 'under20min' | '20to30min' | '30to1hours' | 'over1hours';

export interface CreateMatchDTO {
  userId: string;
  matchType: 'ONE_VS_ONE' | 'TWO_VS_TWO';
  gameType: 'FOUR_BALL' | 'THREE_BALL' | 'POCKET_BALL';
  preferredDate: string | Date;
  playerInfo: {
    name: string;
    phone: string;
    handicap: number;
    storeAddress: number;
  };
}

export interface MatchResponse {
  id: number;
  matchType: string;
  gameType: string;
  status: string;
  playerCount: number;
  currentPlayers: number;
  createdAt: Date | string;
}

export interface PlayerInfo {
  name: string;
  phone: string;
  handicap: string;
}

export interface Store {
  id: number;
  name: string;
  owner_name: string | null;
  address: string;
}

export interface FormData {
  name: string;
  phone: string;
  handicap: string;
  agreeToTerms: boolean;
  store: Store | null;
}

export interface OptionType {
  id: string;
  value: string;
  title: string;
  description: string;
  srcUrl: string;
}

export interface MatchStatus {
  canRequest: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NONE' | undefined;
  matchId: string | null;
  isRequester: boolean;
  matchRole: 'REQUESTER' | 'RECEIVER' | 'OBSERVER' | 'NONE';
  hasPendingMatches: boolean;
  hasUnratedMatches: boolean;
  hasRated: boolean;
  existingMatch: any | null; // 또는 구체적인 매치 타입으로 정의
}

export interface MatchUser {
  id: number;
  name: string;
  mb_id: string;
  profileImage: string;
  distance: number;
  location: string;
  score: {
    fourBall: number;
    threeBall: number;
  };
  preferredTime: string;
  level: string;
  matchCount: number;
  winRate: number;
  lastActive: string;
  preferredGame: string[];
  user_four_ability: number;
  user_three_ability: number;
  preferred_time: string;
  preferGame: string;
}

export interface RegisteredPlayer {
  id: number;
  name: string;
  handicap: number;
  game_type: string;
  match_type: string;
  status: string;
  created_at: string;
  match_date: Date | string;
  billiard_place: string;
  bi_user: {
    mb_id: string;
    name: string;
  };
}

export interface User {
  mb_id: string;
  id: number;
  name: string;
  profileImage: string;
  distance: number;
  location: string;
  score: {
    fourBall: number;
    threeBall: number;
  };
  preferredTime: string;
  level: string;
  matchCount: number;
  winRate: number;
  lastActive: string;
  preferredGame: string[];
  user_four_ability: number;
  user_three_ability: number;
  preferred_time: string;
  preferGame: string;
}

export interface MemberReview {
  id: number;
  author: string;
  date: string;
  comment?: string;
  game_type?: string;
  play_time?: string;
  highRun?: number;
  mannerCategory?: string;
  rulesCategory?: string;
  timeCategory?: string;
  skillLevelCategory?: string;
  likes?: number;
  winner_id?: string; // 승자 ID 추가
  player1_name : string;
  player2_name: string;
  match_id: number;
  match_date: string | undefined;
}

export interface Match {
  match_id: number;
  match_date: string;
  match_status: string;
  game_type: string;
  match_type: string;
  location?: string;
  player1_id: string;
  player1_name?: string;
  player1_dama?: number;
  player1_image?: string;
  player2_id: string;
  player2_name?: string;
  player2_dama?: number;
  player2_image?: string;
  player1_score?: number;
  player2_score?: number;
  winner_id?: string;
  loser_id?: string;
  user_checked_in: boolean;
  opponent_checked_in: boolean;
  no_show_status: number;
  has_rated: boolean;
  opponent_has_rated?: boolean;  // 상대방이 평가했는지 여부
  both_rated?: boolean;         // 양쪽 모두 평가했는지 여부
  venue: Venue;
  preferred_date: string;
}

// 위도와 경도 좌표를 포함한 위치 정보 타입
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// 당구장(매장) 정보 타입
export interface Venue {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Match 타입에 추가될 venue 필드 타입
export interface MatchWithVenue extends Match {
  venue: Venue;
}

// 위치 에러 상태 타입
export interface LocationState {
  currentLocation: Coordinates | null;
  distance: number | null;
  isWithinCheckInDistance: boolean;
  error: string;
  isLoading: boolean;
}

// 위치 변경 액션 타입
export type LocationAction = 
  | { type: 'SET_CURRENT_LOCATION'; payload: Coordinates }
  | { type: 'SET_DISTANCE'; payload: number }
  | { type: 'SET_WITHIN_DISTANCE'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' };

export interface MemberSearchPageProps {
  searchParams: Promise<{
    distance?: string;
    type?: string;
  }>;
}