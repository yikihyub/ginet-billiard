'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, MoreVertical, Bell, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ChatHeader from './_components/hedaer/header';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// 채팅방 타입 정의
interface ChatRoom {
  message_id: string;
  user: string;
  userType: string;
  lastMessage: string;
  isRead: boolean;
  time: string;
}

// 채팅 목록 페이지
export default function MessagePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('전체');
  const [showOptions, setShowOptions] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.mb_id;

  // 채팅방 목록 가져오기
  useEffect(() => {
    async function fetchChatRooms() {
      if (status === 'unauthenticated') {
        router.push('/login?redirect=/message'); // 로그인되지 않은 경우 로그인 페이지로 이동
        return;
      }

      if (!userId) return;

      try {
        setLoading(true);

        // Supabase에서 채팅방 목록 가져오기
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
          .order('updated_at', { ascending: false });

        if (error) {
          throw new Error('채팅방 목록을 가져오는데 실패했습니다.');
        }

        // 데이터 형식 변환
        const formattedRooms: ChatRoom[] = data.map((room) => {
          // 상대방 정보 추출
          const otherUser =
            room.user1_id === userId
              ? {
                  id: room.user2_id,
                  name: room.user2_name,
                  type: room.user2_type,
                }
              : {
                  id: room.user1_id,
                  name: room.user1_name,
                  type: room.user1_type,
                };

          return {
            message_id: room.id,
            user: otherUser.name,
            userType: otherUser.type,
            lastMessage: room.last_message,
            isRead:
              room.user1_id === userId
                ? room.is_read_by_user1
                : room.is_read_by_user2,
            time: new Date(room.updated_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        });

        setChatRooms(formattedRooms);
      } catch (err) {
        console.error('채팅방 목록 가져오기 오류:', err);
        setError(
          err instanceof Error
            ? err.message
            : '채팅방 목록을 가져오는데 실패했습니다.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchChatRooms();

    // Supabase Realtime 구독 설정
    const chatRoomsSubscription = supabase
      .channel('chat_rooms_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms',
          filter: `user1_id=eq.${userId} OR user2_id=eq.${userId}`,
        },
        (payload) => {
          console.log('채팅방 변경 감지:', payload);
          // 변경사항이 있을 때 목록 다시 가져오기
          fetchChatRooms();
        }
      )
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(chatRoomsSubscription);
    };
  }, [userId, status, router]);

  // 필터링된 채팅방 목록
  const filteredChatRooms = chatRooms.filter((room) => {
    if (activeTab === '전체') return true;
    if (activeTab === '안 읽은 채팅방') return !room.isRead;
    if (activeTab === '개인') return room.userType === '개인';
    if (activeTab === '동호회') return room.userType === '동호회';
    return true;
  });

  const handleChatRoomClick = async (message_id: string) => {
    // 채팅방 클릭 시 읽음 상태로 업데이트
    if (userId) {
      // 채팅방 정보 가져오기
      const { data: roomData } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', message_id)
        .single();

      if (roomData) {
        // 읽음 상태 업데이트
        const updateField =
          roomData.user1_id === userId
            ? 'is_read_by_user1'
            : 'is_read_by_user2';

        await supabase
          .from('chat_rooms')
          .update({ [updateField]: true })
          .eq('id', message_id);
      }
    }

    // 채팅방 페이지로 이동
    router.push(`/message/${message_id}`);
  };

  // 채팅방 전체 삭제 기능
  const handleDeleteAllChats = async () => {
    if (!userId || !confirm('모든 채팅방을 삭제하시겠습니까?')) return;

    try {
      // 사용자가 참여한 모든 채팅방 조회
      const { data: userRooms } = await supabase
        .from('chat_rooms')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      if (!userRooms?.length) return;

      // 채팅방 ID 목록
      const roomIds = userRooms.map((room) => room.id);

      // 트랜잭션으로 채팅 메시지와 채팅방 삭제
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .in('room_id', roomIds);

      if (messagesError) throw new Error('메시지 삭제 실패');

      const { error: roomsError } = await supabase
        .from('chat_rooms')
        .delete()
        .in('id', roomIds);

      if (roomsError) throw new Error('채팅방 삭제 실패');

      setChatRooms([]);
      setShowOptions(false);
    } catch (err) {
      console.error('채팅방 삭제 오류:', err);
      alert('채팅방 삭제 중 오류가 발생했습니다.');
    }
  };

  // 유저 이름의 첫 글자를 가져오는 함수
  const getUserInitial = (name: string) => {
    return name && name.length > 0 ? name.charAt(0) : '?';
  };

  // 로딩 중 표시
  if (loading) {
    return <LoadingSpinner />;
  }

  // 에러 표시
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <div className="mb-2 text-lg font-semibold text-red-600">
            오류가 발생했습니다
          </div>
          <div className="text-red-500">{error}</div>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <ChatHeader />

      {/* 탭 메뉴 */}
      <div className="flex space-x-2 bg-white p-2">
        {['전체', '개인', '동호회', '안 읽은 채팅방'].map((tab) => (
          <button
            key={tab}
            className={`rounded-full px-3 py-1 text-sm ${
              activeTab === tab
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}

        {/* 오른쪽: 옵션 버튼 */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <MoreVertical
            className="h-5 w-5 cursor-pointer text-gray-500"
            onClick={() => setShowOptions(!showOptions)}
          />
          {showOptions && (
            <div className="absolute right-4 top-14 z-10 rounded-md bg-white shadow-lg">
              <div className="flex cursor-pointer items-center gap-2 p-4 hover:bg-gray-100">
                <Bell className="h-4 w-4" />
                <span>알림</span>
              </div>
              <div
                className="flex cursor-pointer items-center gap-2 p-4 text-red-500 hover:bg-gray-100"
                onClick={handleDeleteAllChats}
              >
                <Trash2 className="h-4 w-4" />
                <span>모두 삭제</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 알림 안내 */}
      <div className="flex items-center bg-yellow-50 p-3 text-sm">
        <span className="flex-1">
          알림을 켜주세요 중요한 메시지를 놓칠 수 있어요. OS 설정에서 알림을
          켜주세요.
        </span>
        <ChevronLeft className="h-5 w-5 rotate-180" />
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-auto">
        {filteredChatRooms.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <div className="mb-2 text-lg font-medium text-gray-500">
              {activeTab === '전체'
                ? '채팅방이 없습니다'
                : '안 읽은 채팅방이 없습니다'}
            </div>
            <div className="text-sm text-gray-400">
              {activeTab === '전체'
                ? '새로운 대화를 시작해보세요'
                : '모든 메시지를 확인했습니다'}
            </div>
          </div>
        ) : (
          filteredChatRooms.map((room) => (
            <div
              key={room.message_id}
              className="flex cursor-pointer items-start border-b p-4 hover:bg-gray-100"
              onClick={() => handleChatRoomClick(room.message_id)}
            >
              <div className="relative mr-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-white">
                  {getUserInitial(room.user)}
                </div>
                {!room.isRead && (
                  <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="flex items-center gap-1 font-semibold">
                    {room.user}
                    <span className="rounded bg-gray-200 px-1 text-xs text-gray-700">
                      {room.userType}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{room.time}</div>
                </div>
                <div
                  className={`text-sm ${room.isRead ? 'text-gray-500' : 'font-medium text-black'}`}
                >
                  {room.lastMessage}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
