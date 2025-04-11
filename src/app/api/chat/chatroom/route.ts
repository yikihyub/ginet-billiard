// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/config/authOptions';

// export async function GET(request: NextRequest) {
//   try {
//     // 현재 로그인한 사용자 정보 가져오기
//     const session = await getServerSession(authOptions);
//     const currentUserId = session?.user?.mb_id;

//     if (!currentUserId) {
//       return NextResponse.json(
//         { error: '로그인이 필요합니다.' },
//         { status: 401 }
//       );
//     }

//     // async 함수 사용을 위한 Promise 배열 생성 함수
//     const processChatRooms = async (rooms : any) => {
//       return Promise.all(
//         rooms.map(async (participation: any) => {
//           const room = participation.bi_chat_room;
          
//           // 상대방 정보 찾기 (현재 사용자가 아닌 참가자)
//           const otherParticipant = room.bi_chat_room_participants.find(
//               (p: { B: string; }) => p.B !== currentUserId
//           );
          
//           // 마지막 메시지 확인
//           const lastMessage = room.bi_chat_message[0];
          
//           // 메시지 읽음 여부 확인
//           let isRead = true; // 기본값은 읽음으로 설정
          
//           if (lastMessage) {
//             // 내가 보낸 메시지면 무조건 읽은 것으로 처리
//             if (lastMessage.sender_id === currentUserId) {
//               isRead = true;
//             } else {
//               // 내가 받은 메시지인 경우, bi_message_read 테이블에서 읽음 상태 확인
//               try {
//                 // 해당 메시지에 대한 내 읽음 정보 조회
//                 const readStatus = await prisma.bi_message_read.findUnique({
//                   where: {
//                     message_id_user_id: {
//                       message_id: lastMessage.id,
//                       user_id: currentUserId
//                     }
//                   }
//                 });
                
//                 // 읽음 레코드가 있으면 읽은 것으로 처리
//                 isRead = !!readStatus;
//               } catch (error) {
//                 console.error('Error checking message read status:', error);
//                 // 오류 발생 시 안전하게 처리 (읽지 않은 것으로 표시)
//                 isRead = false;
//               }
//             }
//           }
          
//           // 시간 포맷팅
//           let formattedTime = '';
//           if (lastMessage) {
//             const messageDate = new Date(lastMessage.created_at);
//             const now = new Date();
//             const diffMs = now.getTime() - messageDate.getTime();
//             const diffHours = diffMs / (1000 * 60 * 60);
            
//             if (diffHours < 1) {
//               formattedTime = `${Math.floor(diffMs / (1000 * 60))}분 전`;
//             } else if (diffHours < 24) {
//               formattedTime = `${Math.floor(diffHours)}시간 전`;
//             } else if (diffHours < 48) {
//               formattedTime = '어제';
//             } else {
//               formattedTime = messageDate.toLocaleDateString('ko-KR', {
//                 month: 'short',
//                 day: 'numeric'
//               });
//             }
//           }

//           // 상대방 정보가 없을 경우 기본값 설정
//           const otherUser = otherParticipant?.bi_user;
//           const userName = otherUser?.mb_name || '알 수 없음';
          
//           // 사용자 유형 결정 (실제 데이터에 맞게 수정 필요)
//           // 여기서는 mb_level을 기준으로 한 예시일 뿐, 실제 비즈니스 로직에 맞게 수정 필요
//           const userType = otherUser?.mb_level >= 7 ? '당주' : 
//                           otherUser?.mb_level >= 5 ? '판매자' : '일반';

//           return {
//             message_id: room.id, // 채팅방 ID
//             user: userName,
//             userType: userType,
//             lastMessage: lastMessage?.content || '새로운 대화를 시작하세요',
//             time: formattedTime || '방금',
//             isRead: isRead
//           };
//         })
//       );
//     };

//     // 사용자가 속한 모든 채팅방 조회
//     // bi_chat_room_participants 모델을 사용해 조회
//     const userChatRooms = await prisma.bi_chat_room_participants.findMany({
//       where: {
//         B: currentUserId  // B 필드가 사용자 ID를 나타냄
//       },
//       include: {
//         bi_chat_room: {
//           include: {
//             // 같은 채팅방에 속한 다른 참가자들도 가져옴
//             bi_chat_room_participants: {
//               include: {
//                 bi_user: true  // User 정보도 함께 가져옴
//               }
//             },
//             // 채팅방의 최근 메시지를 가져옴
//             bi_message: {
//               orderBy: {
//                 created_at: 'desc'
//               },
//               take: 1
//             }
//           }
//         }
//       }
//     });

//     console.log('Found chat rooms:', userChatRooms.length);

//     // 프론트엔드에서 쉽게 사용할 수 있도록 데이터 가공
//     const formattedChatRooms = userChatRooms.map(async participation => {
//       const room = participation.bi_chat_room;
      
//       // 상대방 정보 찾기 (현재 사용자가 아닌 참가자)
//       const otherParticipant = room.bi_chat_room_participants.find(
//         p => p.B !== currentUserId
//       );
      
//       // 마지막 메시지 확인
//       const lastMessage = room.bi_message[0];
      
//       // 메시지 읽음 여부 확인
//       let isRead = true; // 기본값은 읽음으로 설정
      
//       if (lastMessage) {
//         // 내가 보낸 메시지면 무조건 읽은 것으로 처리
//         if (lastMessage.sender_id === currentUserId) {
//           isRead = true;
//         } else {
//           // 내가 받은 메시지인 경우, bi_message_read 테이블에서 읽음 상태 확인
//           try {
//             // 해당 메시지에 대한 내 읽음 정보 조회
//             const readStatus = await prisma.bi_message_read.findUnique({
//               where: {
//                 message_id_user_id: {
//                   message_id: lastMessage.id,
//                   user_id: currentUserId
//                 }
//               }
//             });
            
//             // 읽음 레코드가 있으면 읽은 것으로 처리
//             isRead = !!readStatus;
//           } catch (error) {
//             console.error('Error checking message read status:', error);
//             // 오류 발생 시 안전하게 처리 (읽지 않은 것으로 표시)
//             isRead = false;
//           }
//         }
//       }
      
//       // 시간 포맷팅
//       let formattedTime = '';
//       if (lastMessage) {
//         const messageDate = new Date(lastMessage.created_at);
//         const now = new Date();
//         const diffMs = now.getTime() - messageDate.getTime();
//         const diffHours = diffMs / (1000 * 60 * 60);
        
//         if (diffHours < 1) {
//           formattedTime = `${Math.floor(diffMs / (1000 * 60))}분 전`;
//         } else if (diffHours < 24) {
//           formattedTime = `${Math.floor(diffHours)}시간 전`;
//         } else if (diffHours < 48) {
//           formattedTime = '어제';
//         } else {
//           formattedTime = messageDate.toLocaleDateString('ko-KR', {
//             month: 'short',
//             day: 'numeric'
//           });
//         }
//       }

//       // 상대방 정보가 없을 경우 기본값 설정
//       const otherUser = otherParticipant?.bi_user;
//       const userName = otherUser?.name || '알 수 없음';

//       return {
//         message_id: room.id, // 채팅방 ID
//         user: userName,
//         lastMessage: lastMessage?.content || '새로운 대화를 시작하세요',
//         time: formattedTime || '방금',
//         isRead: isRead
//       };
//     });

//     return NextResponse.json(formattedChatRooms);
//   } catch (error) {
//     console.error('채팅방 목록 조회 중 오류 발생:', error);
//     return NextResponse.json(
//       { error: '채팅방 목록을 가져오는 중 오류가 발생했습니다.' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

import {  NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/config/authOptions';

export async function GET() {
  try {
    // 인증된 사용자 세션 가져오기
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }



    const userId = session.user.mb_id;

    // 사용자가 참여자인 채팅방 가져오기
    const chatRooms = await prisma.bi_chat_room.findMany({
      where: {
        bi_chat_room_participants: {
          some: {
            user_id: userId!, // 올바른 필드명 사용
          },
        },
      },
      include: {
        bi_chat_room_participants: {
          include: {
            bi_user: true, // 참여자의 사용자 정보 포함
          },
        },
        bi_message: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1, // 가장 최근 메시지 가져오기
          include: {
            bi_message_read_by: true, // 메시지 읽음 상태 포함 (필요시 필드명 확인)
          },
        },
      },
      orderBy: {
        updated_at: 'desc', // 가장 최근 활동 순으로 정렬
      },
    });

    // 응답 포맷팅
    const formattedChatRooms = chatRooms.map((room) => {
      // 다른 참여자 찾기 (현재 사용자 제외)
      const otherParticipants = room.bi_chat_room_participants.filter(
        (participant) => participant.user_id !== userId // 올바른 필드명 사용
      );

      // 다른 사용자의 이름(1:1 채팅) 또는 방 이름(그룹 채팅) 가져오기
      // bi_user 객체에서 사용 가능한 이름 필드 확인 필요
      const otherUserName = otherParticipants.length > 0 && otherParticipants[0].bi_user 
        ? (otherParticipants[0].bi_user.name || otherParticipants[0].bi_user.name || '알 수 없음')
        : '알 수 없음';
        
      const roomName = otherParticipants.length === 1 
        ? otherUserName
        : room.name;

      // 가장 최근 메시지
      const lastMessage = room.bi_message[0]?.content || '';
      
      // 메시지 읽음 여부 확인 (bi_message_read_by 테이블의 실제 필드명 확인 필요)
      // 실제 bi_message_read_by 테이블의 구조에 맞게 수정 필요
      const hasRead = room.bi_message.length > 0 && room.bi_message[0]
        ? room.bi_message[0].bi_message_read_by.some(read => read.user_id === userId) || 
          room.bi_message[0].sender_id === userId : true;
      
      const isRead = hasRead;

      // 메시지 시간 포맷팅
      const messageTime = room.bi_message[0]?.created_at 
        ? formatMessageTime(room.bi_message[0].created_at)
        : formatMessageTime(room.created_at);

      return {
        message_id: room.id,
        user: roomName,
        userType: otherParticipants.length > 1 ? '그룹' : '개인',
        lastMessage,
        isRead,
        time: messageTime,
      };
    });

    return NextResponse.json(formattedChatRooms);
  } catch (error) {
    console.error('채팅방 목록 가져오기 오류:', error);
    return NextResponse.json(
      { error: '채팅방 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 메시지 시간 포맷팅 헬퍼 함수
function formatMessageTime(dateString: Date | string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return '방금 전';
  } else if (diffMins < 60) {
    return `${diffMins}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    // 'YYYY.MM.DD' 형식으로 날짜 포맷팅
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
}