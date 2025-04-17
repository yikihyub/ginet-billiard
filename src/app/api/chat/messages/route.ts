import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const messages = await prisma.bi_message.findMany({
      where: {
        chat_room_id: roomId,
      },
      include: {
        bi_user: {
          select: {
            mb_id: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // 응답 데이터 형태 변환
    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      sender_id: message.sender_id,
      chat_room_id: message.chat_room_id,
      created_at: message.created_at,
      sender: {
        id: message.bi_user.mb_id,
        username: message.bi_user.name,
      }
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}