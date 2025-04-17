import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import cuid from 'cuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, chat_room_id } = await request.json();
    
    if (!content || !chat_room_id) {
      return NextResponse.json(
        { error: 'Content and chat room ID are required' },
        { status: 400 }
      );
    }

    const userId = session.user.mb_id!;

    // ✅ 채팅방 참여자 체크 (복합키로 조회)
    const isParticipant = await prisma.bi_chat_room_participants.findUnique({
      where: {
        chat_room_id_user_id: {
          chat_room_id,
          user_id: userId,
        },
      },
    });

    // ✅ 참여자가 아니라면 자동 추가
    if (!isParticipant) {
      await prisma.bi_chat_room_participants.create({
        data: {
          chat_room_id,
          user_id: userId,
          is_admin: false,
        },
      });
    }

    // 메시지 생성
    const messageId = cuid();
    const message = await prisma.bi_message.create({
      data: {
        id: messageId,
        content,
        chat_room_id,
        sender_id: userId,
      },
      include: {
        bi_user: {
          select: {
            mb_id: true,
            name: true,
          },
        },
      },
    });

    // 자신의 메시지는 읽음 처리
    await prisma.bi_message_read.create({
      data: {
        message_id: messageId,
        user_id: userId,
        chat_room_id,
      },
    });

    await prisma.bi_message_read_by.create({
      data: {
        message_id: messageId,
        user_id: userId,
      },
    });

    // 응답 데이터 포맷팅
    const formattedMessage = {
      id: message.id,
      content: message.content,
      sender_id: message.sender_id,
      chat_room_id: message.chat_room_id,
      created_at: message.created_at,
      sender: {
        id: message.bi_user.mb_id,
        username: message.bi_user.name,
      },
    };

    return NextResponse.json(formattedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
