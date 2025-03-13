export interface CreateMatchDTO {
  userId: string;
  matchType: 'ONE_VS_ONE' | 'TWO_VS_TWO';
  gameType: 'FOUR_BALL' | 'THREE_BALL' | 'POCKET_BALL';
  preferredDate: string | Date;
  playerInfo: {
    name: string;
    phone: string;
    handicap: number;
    storeAddress: string;
  };
}

export interface MatchResponse {
  id: number;
  matchType: string;
  gameType: string;
  status: string;
  playerCount: number;
  currentPlayers: number;
  participants: Array<{
    id: number;
    name: string;
    handicap: number;
    team: number;
  }>;
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
  isRequester: boolean;
  status?: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  matchId?: number;
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
