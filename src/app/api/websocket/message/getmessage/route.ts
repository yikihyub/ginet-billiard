import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId');
  const limit = parseInt(searchParams.get('limit') || '50');
  const before = searchParams.get('before');

  if (!roomId) {
    return NextResponse.json(
      { error: '채팅방 ID가 필요합니다' },
      { status: 400 }
    );
  }

  try {
    // 메시지 조회 쿼리 구성
    const messages = await prisma.bi_message.findMany({
      where: {
        chat_room_id: roomId,
        ...(before ? { created_at: { lt: new Date(before) } } : {}),
      },
      orderBy: {
        created_at: 'desc', // 최신 메시지부터
      },
      take: limit,
      include: {
        bi_user: {
          select: {
            mb_id: true,
            name: true,
          },
        },
        bi_message_read: {
          select: {
            user_id: true,
            read_at: true,
          },
        },
      },
    });

    // 클라이언트에서 사용하기 좋은 형태로 변환
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      senderId: message.sender_id,
      chatRoomId: message.chat_room_id,
      createdAt: message.created_at.toISOString(),
      sender: {
        id: message.bi_user.mb_id,
        username: message.bi_user.name,
      },
      readBy: message.bi_message_read.map((read) => ({
        userId: read.user_id,
        readAt: read.read_at.toISOString(),
      })),
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('메시지 조회 오류:', error);
    return NextResponse.json(
      { error: '메시지를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
