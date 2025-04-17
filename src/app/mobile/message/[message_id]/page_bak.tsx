// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { createClient } from '@supabase/supabase-js';
// import { ArrowLeft, Send, PaperclipIcon, Image } from 'lucide-react';
// import LoadingSpinner from '@/components/ui/loading-spinner';

// // Supabase 클라이언트 설정
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// // 메시지 타입 정의
// interface Message {
//   id: string;
//   sender_id: string;
//   sender_name: string;
//   content: string;
//   created_at: string;
//   is_read: boolean;
// }

// // 채팅방 타입 정의
// interface ChatRoomInfo {
//   id: string;
//   user1_id: string;
//   user1_name: string;
//   user2_id: string;
//   user2_name: string;
//   created_at: string;
// }

// export default function ChatRoomPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { data: session, status } = useSession();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const roomId = params?.roomId as string;
//   const userId = session?.user?.mb_id;
//   const userName = session?.user?.name || '알수없음';

//   // 메시지 목록 스크롤 위치 조정
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // 채팅방 정보 및 메시지 가져오기
//   useEffect(() => {
//     async function fetchChatRoom() {
//       if (status === 'unauthenticated') {
//         router.push('/login?redirect=/message');
//         return;
//       }

//       if (!roomId || !userId) return;

//       try {
//         setLoading(true);

//         // 채팅방 정보 가져오기
//         const { data: roomData, error: roomError } = await supabase
//           .from('chat_rooms')
//           .select('*')
//           .eq('id', roomId)
//           .single();

//         if (roomError) {
//           throw new Error('채팅방 정보를 가져오는데 실패했습니다.');
//         }

//         // 접근 권한 확인 (채팅방 참여자인지)
//         if (roomData.user1_id !== userId && roomData.user2_id !== userId) {
//           router.push('/message');
//           return;
//         }

//         setRoomInfo(roomData);

//         // 메시지 읽음 상태 업데이트
//         const updateField =
//           roomData.user1_id === userId
//             ? 'is_read_by_user1'
//             : 'is_read_by_user2';
//         await supabase
//           .from('chat_rooms')
//           .update({ [updateField]: true })
//           .eq('id', roomId);

//         // 메시지 가져오기
//         const { data: messagesData, error: messagesError } = await supabase
//           .from('chat_messages')
//           .select('*')
//           .eq('room_id', roomId)
//           .order('created_at', { ascending: true });

//         if (messagesError) {
//           throw new Error('메시지를 가져오는데 실패했습니다.');
//         }

//         // 메시지 형식 변환
//         const formattedMessages: Message[] = messagesData.map((msg) => ({
//           id: msg.id,
//           sender_id: msg.sender_id,
//           sender_name: msg.sender_name,
//           content: msg.content,
//           created_at: new Date(msg.created_at).toLocaleString(),
//           is_read: msg.is_read,
//         }));

//         setMessages(formattedMessages);

//         // 읽지 않은 메시지 상태 업데이트
//         const unreadMessages = messagesData
//           .filter((msg) => msg.sender_id !== userId && !msg.is_read)
//           .map((msg) => msg.id);

//         if (unreadMessages.length > 0) {
//           await supabase
//             .from('chat_messages')
//             .update({ is_read: true })
//             .in('id', unreadMessages);
//         }
//       } catch (err) {
//         console.error('채팅방 데이터 가져오기 오류:', err);
//         setError(
//           err instanceof Error
//             ? err.message
//             : '채팅방 데이터를 가져오는데 실패했습니다.'
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchChatRoom();

//     // Supabase Realtime 구독 설정 - 메시지
//     const messagesSubscription = supabase
//       .channel(`room_${roomId}_messages`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'chat_messages',
//           filter: `room_id=eq.${roomId}`,
//         },
//         async (payload) => {
//           console.log('새 메시지 수신:', payload);
//           const newMsg = payload.new;

//           // 다른 사람이 보낸 메시지인 경우 읽음 처리
//           if (newMsg.sender_id !== userId) {
//             await supabase
//               .from('chat_messages')
//               .update({ is_read: true })
//               .eq('id', newMsg.id);
//           }

//           // 새 메시지 추가
//           setMessages((prev) => [
//             ...prev,
//             {
//               id: newMsg.id,
//               sender_id: newMsg.sender_id,
//               sender_name: newMsg.sender_name,
//               content: newMsg.content,
//               created_at: new Date(newMsg.created_at).toLocaleString(),
//               is_read: newMsg.sender_id === userId ? false : true,
//             },
//           ]);
//         }
//       )
//       .subscribe();

//     // 컴포넌트 언마운트 시 구독 해제
//     return () => {
//       supabase.removeChannel(messagesSubscription);
//     };
//   }, [roomId, userId, status, router]);

//   // 메시지 목록이 업데이트될 때마다 스크롤
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // 메시지 전송 함수
//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!newMessage.trim() || !roomId || !userId || !roomInfo) return;

//     try {
//       // 메시지 저장
//       const { data: messageData, error: messageError } = await supabase
//         .from('chat_messages')
//         .insert({
//           room_id: roomId,
//           sender_id: userId,
//           sender_name: userName,
//           content: newMessage,
//           is_read: false,
//         })
//         .select()
//         .single();

//       if (messageError) {
//         throw new Error('메시지 전송에 실패했습니다.');
//       }

//       // 채팅방 마지막 메시지 업데이트
//       const otherUserId =
//         roomInfo.user1_id === userId ? roomInfo.user2_id : roomInfo.user1_id;

//       await supabase
//         .from('chat_rooms')
//         .update({
//           last_message: newMessage,
//           updated_at: new Date().toISOString(),
//           is_read_by_user1: roomInfo.user1_id === userId,
//           is_read_by_user2: roomInfo.user2_id === userId,
//         })
//         .eq('id', roomId);

//       // 입력 필드 초기화
//       setNewMessage('');
//     } catch (err) {
//       console.error('메시지 전송 오류:', err);
//       alert('메시지 전송 중 오류가 발생했습니다.');
//     }
//   };

//   // 상대방 정보 추출
//   const getOtherUser = () => {
//     if (!roomInfo || !userId) return { name: '사용자' };

//     return roomInfo.user1_id === userId
//       ? { name: roomInfo.user2_name }
//       : { name: roomInfo.user1_name };
//   };

//   // 로딩 중 표시
//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // 에러 표시
//   if (error) {
//     return (
//       <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
//         <div className="rounded-lg bg-red-50 p-6 text-center">
//           <div className="mb-2 text-lg font-semibold text-red-600">
//             오류가 발생했습니다
//           </div>
//           <div className="text-red-500">{error}</div>
//           <button
//             className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
//             onClick={() => router.push('/message')}
//           >
//             메시지 목록으로 돌아가기
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const otherUser = getOtherUser();

//   return (
//     <div className="flex h-screen flex-col bg-gray-50">
//       {/* 헤더 */}
//       <div className="flex items-center border-b bg-white p-3 shadow-sm">
//         <button className="mr-3" onClick={() => router.push('/message')}>
//           <ArrowLeft className="h-6 w-6" />
//         </button>
//         <div>
//           <div className="font-semibold">{otherUser.name}</div>
//           <div className="text-xs text-gray-500">
//             {messages.length > 0 &&
//             messages[messages.length - 1].sender_id !== userId
//               ? '방금 전'
//               : '접속 중'}
//           </div>
//         </div>
//       </div>

//       {/* 메시지 목록 */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.length === 0 ? (
//           <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
//             <div className="mb-2 text-lg">대화를 시작해보세요</div>
//             <div className="text-sm">첫 메시지를 보내 대화를 시작하세요</div>
//           </div>
//         ) : (
//           messages.map((message) => {
//             const isMyMessage = message.sender_id === userId;

//             return (
//               <div
//                 key={message.id}
//                 className={`mb-4 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
//               >
//                 {!isMyMessage && (
//                   <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white">
//                     {message.sender_name.charAt(0)}
//                   </div>
//                 )}
//                 <div className="max-w-xs">
//                   {!isMyMessage && (
//                     <div className="mb-1 text-xs text-gray-500">
//                       {message.sender_name}
//                     </div>
//                   )}
//                   <div className="flex">
//                     {isMyMessage && (
//                       <div className="mr-2 self-end text-xs text-gray-500">
//                         {message.is_read ? '읽음' : '안읽음'}
//                       </div>
//                     )}
//                     <div
//                       className={`rounded-2xl px-4 py-2 ${
//                         isMyMessage
//                           ? 'rounded-tr-none bg-blue-500 text-white'
//                           : 'rounded-tl-none bg-gray-200 text-gray-800'
//                       }`}
//                     >
//                       {message.content}
//                       <div className="mt-1 text-right text-xs text-gray-100">
//                         {new Date(message.created_at).toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* 메시지 입력 */}
//       <form
//         onSubmit={sendMessage}
//         className="flex items-center border-t bg-white p-2"
//       >
//         <button type="button" className="mx-2 text-gray-500">
//           <PaperclipIcon className="h-6 w-6" />
//         </button>
//         <button type="button" className="mr-2 text-gray-500">
//           <Image className="h-6 w-6" />
//         </button>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 outline-none focus:border-blue-500"
//           placeholder="메시지를 입력하세요..."
//         />
//         <button
//           type="submit"
//           className="ml-2 rounded-full bg-blue-500 p-2 text-white disabled:bg-blue-300"
//           disabled={!newMessage.trim()}
//         >
//           <Send className="h-5 w-5" />
//         </button>
//       </form>
//     </div>
//   );
// }
