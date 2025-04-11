'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import { Send, ArrowLeft } from 'lucide-react';
import { DMessageGroup, MessageType } from '@/types/(chat)/chat';

import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export default function ClubChatRoom() {
  // 채팅방 파라미터
  const { id: clubId } = useParams<{ id: string }>();

  // 회원아이디 및 이름
  const { data: session } = useSession();
  const userId = session?.user.mb_id;
  const userName = session?.user.name;

  // 메세지
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatRoomInfo, setChatRoomInfo] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    userid: string;
    username: string;
  } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 로드 함수
  const fetchMessages = async (roomId: string) => {
    try {
      // Prisma API를 통해 기존 메시지 가져오기
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
      if (!response.ok) {
        throw new Error('메시지를 불러오는데 실패했습니다');
      }
      const data = await response.json();
      return data.messages;
    } catch (error) {
      console.error('메시지 로드 오류:', error);
      return [];
    }
  };

  // 채팅방 정보 가져오기 (최초 한 번만 실행)
  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        // 채팅방 정보 가져오기
        const response = await fetch(`/api/chat/room?groupId=${clubId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch chat room');
        }

        const roomInfo = await response.json();
        setChatRoomInfo(roomInfo);

        setCurrentUser({
          userid: userId!,
          username: userName!,
        });

        // 채팅방 메시지 로드
        const chatRoomMessages = await fetchMessages(roomInfo.id);
        if (chatRoomMessages && chatRoomMessages.length > 0) {
          setMessages(chatRoomMessages);
        }
      } catch (error) {
        console.error('Error fetching chat room:', error);
        setConnectionError('Failed to fetch chat room');
      }
    };

    if (userId && userName) {
      fetchChatRoom();
    }
  }, [clubId, userId, userName]);

  // Supabase Realtime 구독 설정
  useEffect(() => {
    if (!userId || !chatRoomInfo) return;

    setIsConnected(true);

    // Supabase Realtime 채널 구독
    const channel = supabase
      .channel(`bi_chat_room_${chatRoomInfo.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bi_message',
          filter: `chat_room_id=eq.${chatRoomInfo.id}`,
        },
        (payload) => {
          // 새 메시지가 데이터베이스에 추가될 때 호출됨
          console.log('New message received:', payload);

          // 추가된 메시지 데이터 형식 맞추기
          const fetchMessageDetails = async () => {
            try {
              const response = await fetch(
                `/api/chat/message?messageId=${payload.new.id}`
              );
              if (response.ok) {
                const messageData = await response.json();

                // 중복 메시지 방지 확인
                if (!messages.some((msg) => msg.id === messageData.id)) {
                  setMessages((prevMessages) => [...prevMessages, messageData]);
                }
              }
            } catch (error) {
              console.error('Error fetching message details:', error);
            }
          };

          fetchMessageDetails();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to Supabase Realtime!');
          setIsConnected(true);
          setConnectionError(null);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.error('Supabase Realtime connection closed or error');
          setIsConnected(false);
          setConnectionError('Connection error');
        }
      });

    return () => {
      // 컴포넌트 언마운트 시 구독 해제
      supabase.removeChannel(channel);
    };
  }, [userId, chatRoomInfo, messages]);

  // 메시지 시간 포맷팅 함수
  const formatMessageTime = useCallback((dateStr: string) => {
    try {
      if (!dateStr) {
        return ''; // 날짜 문자열이 없으면 빈 문자열 반환
      }

      const date = new Date(dateStr);

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateStr);
        return '';
      }

      return format(date, 'a h:mm', { locale: ko });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }, []);

  // 메시지 그룹화 함수 (같은 사람이 연속해서 보낸 메시지는 묶음)
  const groupMessages = useCallback(
    (messageList: MessageType[]): DMessageGroup[] => {
      if (!messageList.length) return [];

      return messageList.reduce<DMessageGroup[]>((groups, message, index) => {
        const prevMessage = messageList[index - 1];
        const senderId = message.sender.id || '알수없음';
        const senderName =
          message.sender?.username || message.sender?.mb_nick || '알 수 없음';

        // 이전 메시지가 없거나 다른 사용자의 메시지거나 5분 이상 지난 경우 새 그룹 생성
        if (
          !prevMessage ||
          prevMessage.sender_id !== senderId ||
          new Date(message.created_at).getTime() -
            new Date(prevMessage.created_at).getTime() >
            5 * 60 * 1000
        ) {
          groups.push({
            senderId,
            senderName,
            messages: [message],
          });
        } else {
          // 기존 그룹에 메시지 추가
          groups[groups.length - 1].messages.push(message);
        }

        return groups;
      }, []);
    },
    []
  );

  // 새 메시지 전송
  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newMessage.trim() || !isConnected || !chatRoomInfo || !userId)
        return;

      try {
        // 새 메시지 객체 생성
        const messageData = {
          content: newMessage,
          sender_id: userId,
          chat_room_id: chatRoomInfo.id,
        };

        // API를 통해 메시지 저장 (Prisma)
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        // 입력창 초기화
        setNewMessage('');
      } catch (error) {
        console.error('Message sending error:', error);
      }
    },
    [newMessage, isConnected, chatRoomInfo, userId]
  );

  // 새 메시지가 오면 스크롤 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 그룹화 - 렌더링 최적화를 위해 useMemo 사용
  const messageGroups = React.useMemo(
    () => groupMessages(messages),
    [messages, groupMessages]
  );

  // 연결 오류 표시
  const connectionStatus = isConnected ? (
    <span className="text-xs text-green-500">온라인</span>
  ) : (
    <span className="text-xs text-red-500">
      오프라인 {connectionError && `(${connectionError})`}
    </span>
  );

  return (
    <div className="h-[(100vh - 106px)] flex flex-col bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center">
          <Link href={`/club/search/${clubId}`} className="mr-3">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold">
            {chatRoomInfo?.name || '채팅방'}
          </h1>
        </div>
        {connectionStatus}
      </div>

      {/* 채팅 메시지 영역 */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messageGroups.map((group, groupIndex) => (
            <div
              key={`group-${groupIndex}`}
              className={`flex ${group.senderId === currentUser?.userid ? 'justify-end' : 'justify-start'}`}
            >
              {/* 메시지 그룹 */}
              <div className="max-w-[70%]">
                {/* 보낸 사람 이름 (내 메시지가 아닌 경우만) */}
                {group.senderId !== currentUser?.userid && (
                  <p className="mb-1 text-xs text-gray-500">
                    {group.senderName}
                  </p>
                )}

                {/* 메시지 목록 */}
                <div className="space-y-1">
                  {group.messages.map((message, msgIndex) => (
                    <div key={message.id} className="flex items-end gap-1">
                      {/* 내 메시지인 경우 시간을 왼쪽에 표시 */}
                      {group.senderId === currentUser?.userid &&
                        msgIndex === group.messages.length - 1 && (
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(message.created_at)}
                          </span>
                        )}

                      {/* 메시지 내용 */}
                      <div
                        className={`rounded-2xl px-3 py-2 ${
                          group.senderId === currentUser?.userid
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.content}
                      </div>

                      {/* 내 메시지가 아닌 경우 시간을 오른쪽에 표시 */}
                      {group.senderId !== currentUser?.userid &&
                        msgIndex === group.messages.length - 1 && (
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(message.created_at)}
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* 메시지 입력 영역 */}
      <form onSubmit={handleSendMessage} className="border-t p-3">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
