'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import MatchInfoPanel from '../_components/panel/match-info-panel';

import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Send, ChevronLeft, MoreVertical } from 'lucide-react';

// 채팅 메시지 타입
interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name?: string;
  created_at: string;
  is_read: boolean;
  is_system?: boolean;
  bi_message_read_by?: {
    user_id: string;
    read_at: string;
  }[]; // 읽은 사용자 정보 배열
}

// 채팅방 정보 타입
interface ChatRoom {
  id: string;
  name: string;
  group_id: string; // 매치 ID와 연결
  created_at: string;
  participants: {
    user_id: string;
    user_name: string;
  }[];
  match_info?: {
    match_id: string;
    match_status: string;
    is_requester: boolean;
  };
}

interface MessageItem {
  id: string;
  content: string;
  created_at: string;
  bi_message_read_by?: any[];
}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const userId = session?.user.mb_id;
  const messageId = params?.message_id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInterval = useRef<NodeJS.Timeout | null>(null);

  // 채팅방 정보 로드
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login?redirect=/message');
      return;
    }

    fetchChatRoom();
    return () => {
      if (messageInterval.current) {
        clearInterval(messageInterval.current);
      }
    };
  }, [messageId, status, router]);

  // 채팅 메시지 로드
  useEffect(() => {
    if (chatRoom) {
      fetchMessages();

      // 10초마다 새 메시지 확인
      messageInterval.current = setInterval(fetchMessages, 10000);
    }

    return () => {
      if (messageInterval.current) {
        clearInterval(messageInterval.current);
      }
    };
  }, [chatRoom]);

  // 새 메시지가 추가되면 스크롤 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅방 정보 가져오기
  const fetchChatRoom = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chat/room/${messageId}`);

      if (!response.ok) {
        throw new Error('채팅방 정보를 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      setChatRoom(data);
    } catch (err) {
      console.error('채팅방 정보 가져오기 오류:', err);
      setError(
        err instanceof Error
          ? err.message
          : '채팅방 정보를 가져오는데 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 채팅 메시지 가져오기
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages?roomId=${messageId}`);

      if (!response.ok) {
        throw new Error('메시지를 가져오는데 실패했습니다.');
      }

      const data = await response.json();

      // 기존 메시지와 새 메시지를 비교하여 새 메시지가 있는 경우만 읽음 처리
      const newMessages = data.messages;
      const hasNewMessages =
        newMessages.length > messages.length ||
        (newMessages.length > 0 &&
          messages.length > 0 &&
          newMessages[newMessages.length - 1].id !==
            messages[messages.length - 1].id);

      setMessages(newMessages);

      // 새 메시지가 있고 현재 사용자가 아닌 메시지가 있을 때만 읽음 처리
      if (
        hasNewMessages &&
        newMessages.some(
          (msg: Message) =>
            msg.sender_id !== userId &&
            !msg.bi_message_read_by?.some((read) => read.user_id === userId)
        )
      ) {
        await markMessagesAsRead();
      }
    } catch (err) {
      console.error('메시지 가져오기 오류:', err);
    }
  };

  // 메시지 읽음 처리
  const markMessagesAsRead = async () => {
    try {
      const response = await fetch(`/api/chat/mark-read/${messageId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('메시지 읽음 처리에 실패했습니다.');
      }

      // 읽음 처리 후 메시지 상태 업데이트
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          // 내가 보낸 메시지는 건너뛰기
          if (msg.sender_id === userId) return msg;

          // 이미 내가 읽었으면 건너뛰기
          if (msg.bi_message_read_by?.some((read) => read.user_id === userId))
            return msg;

          // 읽음 처리 반영
          return {
            ...msg,
            bi_message_read_by: [
              ...(msg.bi_message_read_by || []),
              { user_id: userId || '', read_at: new Date().toISOString() },
            ],
          };
        })
      );
    } catch (err) {
      console.error('메시지 읽음 처리 오류:', err);
    }
  };

  // 새 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          chat_room_id: messageId,
          sender_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('메시지 전송에 실패했습니다.');
      }

      // 메시지 전송 성공
      setNewMessage('');
      // 메시지 바로 업데이트
      const sentMessage: Message = {
        id: Date.now().toString(), // 임시 ID
        content: newMessage,
        sender_id: userId,
        sender_name: session?.user.name || '',
        created_at: new Date().toISOString(),
        is_read: true,
        bi_message_read_by: [
          {
            user_id: userId || '',
            read_at: new Date().toISOString(),
          },
        ], // 자신은 이미 읽은 상태
      };

      setMessages((prev) => [...prev, sentMessage]);

      // 서버에서 최신 데이터 가져오기
      setTimeout(fetchMessages, 500);
    } catch (err) {
      console.error('메시지 전송 오류:', err);
      toast({
        title: '메시지 전송 실패',
        description: '메시지를 전송하는 데 문제가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 메시지 전송 (엔터키)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 채팅방 나가기
  const leaveChat = async () => {
    if (confirm('정말로 채팅방을 나가시겠습니까?')) {
      try {
        const response = await fetch(`/api/chat/leave/${messageId}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('채팅방 나가기에 실패했습니다.');
        }

        router.push('/message');
        toast({
          title: '채팅방 나가기',
          description: '채팅방에서 나갔습니다.',
        });
      } catch (err) {
        console.error('채팅방 나가기 오류:', err);
        toast({
          title: '오류 발생',
          description: '채팅방 나가기에 실패했습니다.',
          variant: 'destructive',
        });
      }
    }
  };

  // 로딩 화면
  if (loading && !chatRoom) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-2 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          <div>채팅방 로딩 중...</div>
        </div>
      </div>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <div className="mb-2 text-lg font-semibold text-red-600">
            오류가 발생했습니다
          </div>
          <div className="text-red-500">{error}</div>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => router.push('/message')}
          >
            채팅방 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 날짜 포맷팅
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return '오늘';
    } else if (isYesterday(date)) {
      return '어제';
    } else {
      return format(date, 'yyyy년 M월 d일');
    }
  };

  // 메시지 시간 포맷팅
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  // 메시지 그룹화 (카카오톡 스타일)
  const renderMessages = () => {
    if (!messages || messages.length === 0) {
      return (
        <div className="py-10 text-center text-gray-500">
          메시지가 없습니다.
        </div>
      );
    }

    // 메시지 날짜순 정렬
    const sortedMessages = [...messages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const totalParticipants = chatRoom?.participants.length || 0;
    const groupedMessages: JSX.Element[] = [];

    let lastSenderId = '';
    let lastMessageDate: Date | null = null;

    // 메시지 시간 표시 여부 결정 (연속 메시지의 마지막에만 시간 표시)
    let messageGroup: MessageItem[] = [];

    // 발신자 이름과 프로필 표시 여부
    let shouldShowSender = false;

    // 마지막 메시지 처리용 함수
    const renderMessageGroup = (
      messages: MessageItem[],
      isCurrentUser: boolean,
      senderName?: string
    ) => {
      if (messages.length === 0) return;

      // 현재 유저가 보낸 메시지 그룹 (오른쪽 정렬)
      if (isCurrentUser) {
        // 마지막 메시지에 대한 읽음 상태 확인
        const lastMsg = messages[messages.length - 1];
        const readByCount = lastMsg.bi_message_read_by?.length || 1; // 최소 자신은 읽은 상태
        const isRead = readByCount >= totalParticipants; // 모든 참가자가 읽었는지

        const bubbles = messages.map((msg, idx) => {
          const isLastBubble = idx === messages.length - 1;

          return (
            <div key={msg.id} className="flex flex-col items-end">
              <div
                className={`rounded-lg bg-blue-500 px-3 py-2 text-white ${
                  !isLastBubble ? 'mb-1' : ''
                }`}
              >
                {msg.content}
              </div>

              {/* 마지막 말풍선에만 시간과 읽음 표시 */}
              {isLastBubble && (
                <div className="mt-1 flex items-end text-xs text-gray-500">
                  {isRead ? (
                    <span className="mr-1 text-green-500">읽음</span>
                  ) : (
                    <span className="mr-1 text-gray-400">안읽음</span>
                  )}
                  <span>{formatMessageTime(msg.created_at)}</span>
                </div>
              )}
            </div>
          );
        });

        groupedMessages.push(
          <div
            key={`group-${messages[0].id}`}
            className="mb-3 flex justify-end"
          >
            <div className="max-w-[75%]">{bubbles}</div>
          </div>
        );
      }
      // 상대방이 보낸 메시지 그룹 (왼쪽 정렬)
      else {
        const bubbles = messages.map((msg, idx) => {
          const isLastBubble = idx === messages.length - 1;

          return (
            <div key={msg.id} className="flex flex-col">
              <div
                className={`rounded-lg bg-gray-100 px-3 py-2 ${
                  !isLastBubble ? 'mb-1' : ''
                }`}
              >
                {msg.content}
              </div>

              {/* 마지막 말풍선에만 시간 표시 */}
              {isLastBubble && (
                <div className="mt-1 text-xs text-gray-500">
                  {formatMessageTime(msg.created_at)}
                </div>
              )}
            </div>
          );
        });

        groupedMessages.push(
          <div key={`group-${messages[0].id}`} className="mb-3 flex">
            {shouldShowSender ? (
              <div className="mr-2 h-8 w-8 flex-shrink-0 rounded-full bg-gray-300 text-center leading-8 text-white">
                {senderName?.charAt(0) || '?'}
              </div>
            ) : (
              <div className="mr-2 w-8"></div>
            )}

            <div className="max-w-[75%]">
              {shouldShowSender && (
                <div className="mb-1 text-sm font-semibold">
                  {senderName || '알 수 없음'}
                </div>
              )}

              {bubbles}
            </div>
          </div>
        );
      }
    };

    // 각 메시지 처리
    sortedMessages.forEach((message, index) => {
      const messageDate = new Date(message.created_at);
      const isSystem = message.is_system || message.sender_id === 'system';

      // 시스템 메시지는 별도 처리
      if (isSystem) {
        // 이전 그룹이 있으면 먼저 렌더링
        if (messageGroup.length > 0) {
          renderMessageGroup(
            messageGroup,
            lastSenderId === userId,
            sortedMessages.find((m) => m.sender_id === lastSenderId)
              ?.sender_name
          );
          messageGroup = [];
        }

        groupedMessages.push(
          <div key={message.id} className="my-2 flex justify-center">
            <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {message.content}
            </div>
          </div>
        );

        lastSenderId = '';
        return;
      }

      // 날짜 변경 시 헤더 표시
      if (!lastMessageDate || !isSameDay(lastMessageDate, messageDate)) {
        // 이전 그룹이 있으면 먼저 렌더링
        if (messageGroup.length > 0) {
          renderMessageGroup(
            messageGroup,
            lastSenderId === userId,
            sortedMessages.find((m) => m.sender_id === lastSenderId)
              ?.sender_name
          );
          messageGroup = [];
        }

        groupedMessages.push(
          <div key={`date-${message.id}`} className="my-4 flex justify-center">
            <div className="rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-700">
              {formatDateHeader(message.created_at)}
            </div>
          </div>
        );

        lastMessageDate = messageDate;
        lastSenderId = '';
      }

      // 발신자가 바뀌었거나 긴 시간 간격이 있으면 이전 그룹 렌더링
      const senderChanged = message.sender_id !== lastSenderId;

      if (senderChanged && messageGroup.length > 0) {
        renderMessageGroup(
          messageGroup,
          lastSenderId === userId,
          sortedMessages.find((m) => m.sender_id === lastSenderId)?.sender_name
        );
        messageGroup = [];
      }

      // 발신자 정보 업데이트
      shouldShowSender = senderChanged;
      lastSenderId = message.sender_id;

      // 현재 메시지를 그룹에 추가
      messageGroup.push({
        id: message.id,
        content: message.content,
        created_at: message.created_at,
        bi_message_read_by: message.bi_message_read_by || [],
      });

      // 마지막 메시지인 경우 처리
      if (index === sortedMessages.length - 1) {
        renderMessageGroup(
          messageGroup,
          lastSenderId === userId,
          sortedMessages.find((m) => m.sender_id === lastSenderId)?.sender_name
        );
      }
    });

    return groupedMessages;
  };

  return (
    <div className="flex h-screen flex-col">
      {/* 채팅방 헤더 */}
      <div className="flex items-center justify-between border-b bg-white p-3">
        <div className="flex items-center">
          <ChevronLeft
            className="mr-2 h-6 w-6 cursor-pointer"
            onClick={() => router.push('/mobile/message')}
          />
          <div>
            <div className="font-semibold">{chatRoom?.name}</div>
            <div className="text-xs text-gray-500">
              {chatRoom?.participants.length}명 참여중
            </div>
          </div>
        </div>

        <div className="relative">
          <MoreVertical
            className="h-6 w-6 cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          />

          {showOptions && (
            <div className="absolute right-0 top-8 z-10 w-40 rounded-md bg-white shadow-lg">
              <div
                className="cursor-pointer p-3 text-red-500 hover:bg-gray-100"
                onClick={leaveChat}
              >
                채팅방 나가기
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 매치 정보 패널 (매치 ID가 있는 경우만 표시) */}
      {chatRoom?.match_info && (
        <MatchInfoPanel
          matchId={chatRoom.match_info.match_id}
          userId={userId || ''}
          isRequester={chatRoom.match_info.is_requester}
          onUpdateSuccess={fetchChatRoom}
        />
      )}

      <div className="bg-yellow-50 px-4 py-2 text-center text-xs text-gray-800">
        ⚠️ 상호간의 존중을 지켜주세요. 욕설, 음란 발언, 개인정보 공유는 금지되어
        있습니다. 위반 시 게임 내 패널티가 부과되며, 필요한 경우 법적 조치가
        취해질 수 있습니다.
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className="border-t bg-white p-3">
        <div className="flex">
          <textarea
            className="flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm"
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white disabled:bg-gray-300"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
