import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 채팅방 ID 가져오기
    const chatRoomId = (await params).id;
    
    if (!chatRoomId) {
      return NextResponse.json(
        { error: '채팅방 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 인증된 사용자 확인
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const userId = session.user.mb_id;
    
    // 채팅방 조회
    const chatRoom = await prisma.bi_chat_room.findUnique({
      where: { id: chatRoomId },
      include: {
        bi_chat_room_participants: {
          include: {
            bi_user: {
              select: {
                mb_id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    
    if (!chatRoom) {
      return NextResponse.json(
        { error: '채팅방을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 사용자가 채팅방 참가자인지 확인
    const isParticipant = chatRoom.bi_chat_room_participants.some(
      (participant) => participant.user_id === userId
    );
    
    if (!isParticipant) {
      return NextResponse.json(
        { error: '이 채팅방에 접근할 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    // 참가자 정보 포맷팅
    const participants = chatRoom.bi_chat_room_participants.map((participant) => ({
      user_id: participant.user_id,
      user_name: participant.bi_user?.name || '알 수 없음',
      is_admin: participant.is_admin || false,
    }));

    const matchUid = chatRoom.group_id?.replace(/^group-/, '');

    // 매치 정보 조회 (group_id가 매치 ID인 경우)
    let matchInfo = null;
    if (chatRoom.group_id) {
      const match = await prisma.bi_match.findUnique({
        where: { match_uid: matchUid },
      });
      
      if (match) {
        matchInfo = {
            match_id: match.match_id,
            match_status: match.match_status,
            player1_id: match.player1_id,
            player2_id: match.player2_id,
            preferred_date: match.preferred_date,
            game_type: match.game_type,
            location: match.location,
            is_requester: match.player1_id === userId,
        };
      }
    }
    
    // 응답 데이터 구성
    const chatRoomData = {
      id: chatRoom.id,
      name: chatRoom.name,
      group_id: chatRoom.group_id,
      created_at: chatRoom.created_at,
      updated_at: chatRoom.updated_at,
      participants: participants,
      match_info: matchInfo,
    };
    
    return NextResponse.json(chatRoomData);
  } catch (error) {
    console.error('채팅방 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '채팅방 정보를 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}