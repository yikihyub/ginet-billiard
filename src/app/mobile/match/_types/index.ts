import { ReactNode } from "react";

export interface MemberSearchPageLayoutProps {
  children: ReactNode;
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

// 컨텍스트에서 제공할 상태와 함수들의 타입 정의
export interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  refreshUsers: () => Promise<void>;
  gameType: string;
  setGameType: (type: string) => void;
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

export interface MatchContextType {
  players: RegisteredPlayer[];
  isLoading: boolean;
  processingMatchId: string | null;
  activeMatches: number;
  totalPlayers: number;
  searchQuery: string;
  activeTab: string;
  userId: string | undefined;
  fetchPlayers: () => Promise<void>;
  handleMatchRequest: (player: RegisteredPlayer) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
}

export interface MatchStatsProps {
  activeMatches: number;
  totalPlayers: number;
  popularGame?: string;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
}

export interface MatchCardProps {
  player: RegisteredPlayer;
  userId?: string;
  isProcessing: boolean;
  onMatchRequest: (player: RegisteredPlayer) => Promise<void>;
}

export interface StatusBadgeProps {
  status: string;
}

export interface MatchDetail {
  match_id: string;
  player1_id: string;
  player2_id: string;
  match_status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATE';
  request_status?: string;
  preferred_date: string | null;
  match_date?: string | null;
  response_date?: string | null;
  completion_date?: string | null;
  game_type: 'THREE_BALL' | 'FOUR_BALL' | 'THREE_CUSHION' | null;
  location: string | null;
  message?: string | null;
  created_at?: Date;
  updated_at?: Date;
}