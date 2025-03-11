import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ChatRoom {
  id: string;
  name: string;
  group_id: string;
  created_at: Date;
  updated_at: Date;
  last_message_id: string | null;
  last_message_content: string | null;
  last_message_sender_id: string | null;
  last_message_created_at: Date | null;
  last_message_sender_name: string | null;
  unread_count: string | number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: '사용자 ID가 필요합니다' },
      { status: 400 }
    );
  }

  try {
    // Raw SQL을 사용하여 사용자의 채팅방 목록과 마지막 메시지 조회
    const chatRooms = await prisma.$queryRaw<ChatRoom[]>`
      SELECT 
        cr.id, 
        cr.name, 
        cr.group_id,
        cr.created_at,
        cr.updated_at,
        lm.id as last_message_id,
        lm.content as last_message_content,
        lm.sender_id as last_message_sender_id,
        lm.created_at as last_message_created_at,
        u.mb_nick as last_message_sender_name,
        (
          SELECT COUNT(*) 
          FROM "public"."bi_message" m
          LEFT JOIN "public"."bi_message_read" mr ON m.id = mr.message_id AND mr.user_id = ${userId}
          WHERE m.chat_room_id = cr.id AND mr.id IS NULL AND m.sender_id != ${userId}
        ) as unread_count
      FROM "public"."bi_chat_room" cr
      JOIN "public"."bi_chat_room_participants" p ON p."A" = cr.id
      LEFT JOIN LATERAL (
        SELECT m.*
        FROM "public"."bi_message" m
        WHERE m.chat_room_id = cr.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN "public"."bi_user" u ON lm.sender_id = u.mb_id
      WHERE p."B" = ${userId}
      ORDER BY lm.created_at DESC NULLS LAST
    `;

    // 결과 포맷팅
    const formattedRooms = chatRooms.map((room: any) => ({
      id: room.id,
      name: room.name,
      groupId: room.group_id,
      createdAt: room.created_at.toISOString(),
      updatedAt: room.updated_at.toISOString(),
      lastMessage: room.last_message_id
        ? {
            id: room.last_message_id,
            content: room.last_message_content,
            senderId: room.last_message_sender_id,
            senderName: room.last_message_sender_name,
            createdAt: room.last_message_created_at.toISOString(),
          }
        : null,
      unreadCount: Number(room.unread_count),
    }));

    return NextResponse.json({ chatRooms: formattedRooms });
  } catch (error) {
    console.error('채팅방 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '채팅방 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
