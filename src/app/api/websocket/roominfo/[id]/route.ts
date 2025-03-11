import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const chatRoomId = (await params).id;

    // Fetch the chat room with participants
    const chatRoom = await prisma.bi_chat_room.findUnique({
      where: {
        id: chatRoomId,
      },
      include: {
        bi_chat_room_participants: {
          include: {
            bi_user: true,
          },
        },
      },
    });

    if (!chatRoom) {
      return NextResponse.json(
        { error: 'Chat room not found' },
        { status: 404 }
      );
    }

    // Format the response to match your frontend needs
    const formattedChatRoom = {
      id: chatRoom.id,
      name: chatRoom.name,
      groupId: chatRoom.group_id,
      participants: chatRoom.bi_chat_room_participants.map((participant) => ({
        id: participant.bi_user.mb_id,
        username: participant.bi_user.name || 'Anonymous',
      })),
    };

    return NextResponse.json(formattedChatRoom);
  } catch (error) {
    console.error('Error fetching chat room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat room' },
      { status: 500 }
    );
  }
}
