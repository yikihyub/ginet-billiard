// 사용자 레벨 타입
export type UserLevel = 'ADMIN' | 'MANAGER' | 'MEMBER' | 'RESTRICTED';

// 게임 타입
export type GameType = 'FOUR_BALL' | 'THREE_BALL' | 'POCKET_BALL';

// 사용자 타입 정의
export interface User {
  id: number;
  name: string;
  email: string;
  phonenum: string | null;
  preferGame: GameType;
  loginAt: string;
  createdAt: string;
  profile_image: string | null;
  provider: string | null;
  is_banned: boolean;
  ban_reason: string | null;
  ban_expires_at: string | null;
  warning_count: number;
  trust_score: number;
  bi_level: UserLevel;
}

// 필터 타입 정의
export interface Filters {
  level: string;
  status: string;
  game: string;
  warningCount: string;
}

export interface UserBanModalProps {
  userId: number;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: number, reason: string, duration: number) => void;
}

export interface UserTableProps {
  users: User[];
  isLoading: boolean;
  filteredUsers: User[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  usersPerPage: number;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  sortField: keyof User;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof User) => void;
  onViewDetails: (user: User) => void;
  onBanUser: (user: User) => void;
  onUnbanUser: (userId: number) => void;
}

export interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onBanUser: () => void;
  onUnbanUser: () => void;
}

export interface UserSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

// 사용자 통계 정보 타입
export interface UserStats {
  totalUsers: number;
  newUsers: number;
  bannedUsers: number;
  reportedUsers: number;
}

// API 응답 타입
export interface ApiResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  stats?: UserStats;
}