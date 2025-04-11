// 채팅 메시지 타입
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name?: string;
  chat_room_id: string;
  created_at: string;
  is_read: boolean;
  is_system?: boolean;
}

// 채팅방 정보 타입
export interface ChatRoom {
  id: string;
  name: string;
  group_id: string; // 매치 ID와 연결
  created_at: string;
  updated_at: string;
  participants: ChatRoomParticipant[];
  match_info?: MatchInfo;
}

// 채팅방 참가자 타입
export interface ChatRoomParticipant {
  chat_room_id: string;
  user_id: string;
  user_name: string;
  is_admin?: boolean;
  last_read_message_id?: string;
  created_at?: string;
}

// 채팅방 목록 아이템 타입
export interface ChatRoomListItem {
  message_id: string;
  user: string;
  userType: string;
  lastMessage: string;
  isRead: boolean;
  time: string;
  chat_room_id: string;
  match_id?: string;
}

// 매치 정보 타입 (채팅방에서 사용)
export interface MatchInfo {
  match_id: string;
  player1_id: string;
  player2_id: string;
  match_status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATE' | 'CANCELLED';
  preferred_date: string | null;
  game_type: string | null;
  location: string | null;
  is_requester: boolean; // 현재 사용자가 요청자인지 여부
}

// 매치 변경 요청 타입
export interface MatchChangeRequest {
  request_id: string;
  match_id: string;
  requester_id: string;
  recipient_id: string;
  request_type: 'UPDATE' | 'CANCEL';
  reason: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requested_at: string;
  responded_at?: string;
  new_date?: string | null;
  new_location?: string | null;
}

// 일정 변경 요청 프롭스 타입
export interface ScheduleUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  userId: string;
  onSubmit: (reason: string) => Promise<void>;
}

// 매치 취소 요청 프롭스 타입
export interface MatchCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  userId: string;
  onSubmit: (reason: string) => Promise<void>;
}

// 매치 정보 패널 프롭스 타입
export interface MatchInfoPanelProps {
  matchId: string;
  userId: string;
  isRequester: boolean;
  onUpdateSuccess?: () => void;
}


