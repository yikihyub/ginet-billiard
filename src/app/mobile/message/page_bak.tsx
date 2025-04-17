// 'use client';

// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, MoreVertical, Bell, Trash2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import LoadingSpinner from '@/components/ui/loading-spinner';
// import ChatHeader from './_components/hedaer/header';

// // 채팅방 타입 정의
// interface ChatRoom {
//   message_id: string;
//   user: string;
//   userType: string;
//   lastMessage: string;
//   isRead: boolean;
//   time: string;
// }

// // 채팅 목록 페이지
// export default function MessagePage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [activeTab, setActiveTab] = useState('전체');
//   const [showOptions, setShowOptions] = useState(false);
//   const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const userId = session?.user.mb_id;
//   console.log(userId);

//   // 채팅방 목록 가져오기
//   useEffect(() => {
//     async function fetchChatRooms() {
//       if (status === 'unauthenticated') {
//         router.push('/login?redirect=/message'); // 로그인되지 않은 경우 로그인 페이지로 이동
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch('/api/chat/chatroom');

//         if (!response.ok) {
//           throw new Error('채팅방 목록을 가져오는데 실패했습니다.');
//         }

//         const data = await response.json();
//         setChatRooms(data);
//       } catch (err) {
//         console.error('채팅방 목록 가져오기 오류:', err);
//         setError(
//           err instanceof Error
//             ? err.message
//             : '채팅방 목록을 가져오는데 실패했습니다.'
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchChatRooms();
//   }, [status, router]);

//   // 필터링된 채팅방 목록
//   const filteredChatRooms = chatRooms.filter((room) => {
//     if (activeTab === '전체') return true;
//     if (activeTab === '안 읽은 채팅방') return !room.isRead;
//     return true;
//   });

//   const handleChatRoomClick = (message_id: string) => {
//     router.push(`/message/${message_id}`);
//   };

//   // 채팅방 전체 삭제 기능
//   const handleDeleteAllChats = async () => {
//     if (confirm('모든 채팅방을 삭제하시겠습니까?')) {
//       try {
//         const response = await fetch('/api/message/delete-all', {
//           method: 'DELETE',
//         });

//         if (response.ok) {
//           setChatRooms([]);
//           setShowOptions(false);
//         } else {
//           alert('채팅방 삭제에 실패했습니다.');
//         }
//       } catch (err) {
//         console.error('채팅방 삭제 오류:', err);
//         alert('채팅방 삭제 중 오류가 발생했습니다.');
//       }
//     }
//   };

//   // 유저 이름의 첫 글자를 가져오는 함수
//   const getUserInitial = (name: string) => {
//     return name && name.length > 0 ? name.charAt(0) : '?';
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
//             onClick={() => window.location.reload()}
//           >
//             다시 시도
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen flex-col bg-gray-50">
//       <ChatHeader />

//       {/* 탭 메뉴 */}
//       <div className="flex space-x-2 bg-white p-2">
//         {['전체', '개인', '동호회', '안 읽은 채팅방'].map((tab) => (
//           <button
//             key={tab}
//             className={`rounded-full px-3 py-1 text-sm ${
//               activeTab === tab
//                 ? 'bg-black text-white'
//                 : 'bg-gray-100 text-gray-700'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}

//         {/* 오른쪽: 옵션 버튼 */}
//         <div className="flex flex-1 items-center justify-end gap-4">
//           <MoreVertical
//             className="h-5 w-5 cursor-pointer text-gray-500"
//             onClick={() => setShowOptions(!showOptions)}
//           />
//           {showOptions && (
//             <div className="absolute right-4 top-14 z-10 rounded-md bg-white shadow-lg">
//               <div className="flex cursor-pointer items-center gap-2 p-4 hover:bg-gray-100">
//                 <Bell className="h-4 w-4" />
//                 <span>알림</span>
//               </div>
//               <div
//                 className="flex cursor-pointer items-center gap-2 p-4 text-red-500 hover:bg-gray-100"
//                 onClick={handleDeleteAllChats}
//               >
//                 <Trash2 className="h-4 w-4" />
//                 <span>모두 삭제</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 알림 안내 */}
//       <div className="flex items-center bg-yellow-50 p-3 text-sm">
//         <span className="flex-1">
//           알림을 켜주세요 중요한 메시지를 놓칠 수 있어요. OS 설정에서 알림을
//           켜주세요.
//         </span>
//         <ChevronLeft className="h-5 w-5 rotate-180" />
//       </div>

//       {/* 채팅방 목록 */}
//       <div className="flex-1 overflow-auto">
//         {filteredChatRooms.length === 0 ? (
//           <div className="flex h-64 flex-col items-center justify-center">
//             <div className="mb-2 text-lg font-medium text-gray-500">
//               {activeTab === '전체'
//                 ? '채팅방이 없습니다'
//                 : '안 읽은 채팅방이 없습니다'}
//             </div>
//             <div className="text-sm text-gray-400">
//               {activeTab === '전체'
//                 ? '새로운 대화를 시작해보세요'
//                 : '모든 메시지를 확인했습니다'}
//             </div>
//           </div>
//         ) : (
//           filteredChatRooms.map((room) => (
//             <div
//               key={room.message_id}
//               className="flex cursor-pointer items-start border-b p-4 hover:bg-gray-100"
//               onClick={() => handleChatRoomClick(room.message_id)}
//             >
//               <div className="relative mr-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-white">
//                   {getUserInitial(room.user)}
//                 </div>
//                 {!room.isRead && (
//                   <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500"></div>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <div className="flex items-center gap-1 font-semibold">
//                     {room.user}
//                     <span className="rounded bg-gray-200 px-1 text-xs text-gray-700">
//                       {room.userType}
//                     </span>
//                   </div>
//                   <div className="text-xs text-gray-500">{room.time}</div>
//                 </div>
//                 <div
//                   className={`text-sm ${room.isRead ? 'text-gray-500' : 'font-medium text-black'}`}
//                 >
//                   {room.lastMessage}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
