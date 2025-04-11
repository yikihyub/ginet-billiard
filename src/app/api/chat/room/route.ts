import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    // 그룹 ID로 채팅방 조회
    let chatRoom = await prisma.bi_chat_room.findFirst({
      where: {
        group_id: `group-${groupId}`
      }
    });

    // 채팅방이 없으면 새로 생성
    if (!chatRoom) {
      // 그룹 정보 조회 단계 건너뛰고 직접 채팅방 생성
      chatRoom = await prisma.bi_chat_room.create({
        data: {
          id: `room-${groupId}`,
          name: `채팅방 ${groupId}`, // 기본 이름 사용
          group_id: groupId,
          updated_at: new Date()
        }
      });
    }

    return NextResponse.json(chatRoom);
  } catch (error) {
    console.error('Error fetching chat room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat room' },
      { status: 500 }
    );
  }
}