// 기본 메시지 타입
export interface ChatMessage {
  id?: string;
  type: 'message' | 'join' | 'leave' | 'read' | 'error';
  senderId: string;
  username?: string;
  content?: string;
  roomId?: string;
  messageId?: string;
  timestamp?: number;
  message?: string; // 에러 메시지 등
}

// 클라이언트 측 표시용 메시지 타입
export interface DisplayMessage {
  id: string;
  content: string;
  sender_id: string;
  chat_room_id: string;
  created_at: string;
  sender: {
    image: string | null;
    id?: string;
    username?: string;
    mb_nick?: string;
  };
  isRead?: boolean;
}

// 채팅방 정보 타입
export interface ChatRoom {
  id: string;
  name: string;
  groupId?: string;
  isGroup: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  participants: {
    id: string;
    username: string;
    image: string | null;
  }[];
}

// 메시지 그룹 타입 (UI용)
export interface MessageGroup {
  senderId: string;
  senderName: string;
  messages: DisplayMessage[];
  // avatar?: string | null;
}

// 메시지 타입 정의
export interface ChatMessage {
  type: 'message' | 'join' | 'leave' | 'read' | 'error';
  senderId: string;
  username?: string;
  content?: string;
  roomId?: string;
  messageId?: string;
  timestamp?: number;
  id?: string; // 데이터베이스에서 생성된 ID
  message?: string; // 에러 메시지 등
  originalMessage?: any; // 에러가 발생한 원본 메시지
}

// 클라이언트 측 표시용 메시지 타입
export interface DisplayMessage {
  id: string;
  content: string;
  sender_id: string;
  chat_room_id: string;
  created_at: string;
  sender: {
    image: string | null;
    id?: string;
    username?: string;
    mb_nick?: string;
  };
  isRead?: boolean;
}

// 메시지 그룹 타입 (UI용)
export interface DMessageGroup {
  senderId: string;
  senderName: string;
  messages: MessageType[];
  // avatar?: string | null;
}

export interface MessageType {
  id: string;
  content: string;
  sender_id: string;
  chat_room_id?: string;
  created_at: string;
  sender: {
    image: string | null;
    id?: string;
    username?: string;
    mb_nick?: string;
  };
}
