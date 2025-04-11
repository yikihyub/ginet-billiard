import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const message = await prisma.bi_message.findUnique({
      where: {
        id: messageId,
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

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // 응답 데이터 형태 변환
    const formattedMessage = {
      id: message.id,
      content: message.content,
      sender_id: message.sender_id,
      chat_room_id: message.chat_room_id,
      created_at: message.created_at.toISOString(),
      sender: {
        id: message.bi_user.mb_id,
        username: message.bi_user.name,
      }
    };

    return NextResponse.json(formattedMessage);
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}