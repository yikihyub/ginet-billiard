import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
    }

    const userId = session.user.mb_id;
    const roomId = (await params).roomId;

    if (!userId) {
      return NextResponse.json({ message: '사용자 ID가 없습니다.' }, { status: 400 });
    }

    // 1. 채팅방의 안 읽은 메시지 찾기 (자신이 보낸 메시지 제외)
    const unreadMessages = await prisma.bi_message.findMany({
      where: {
        chat_room_id: roomId,
        sender_id: { not: userId }, // 자신이 보낸 메시지는 제외
        NOT: {
          bi_message_read_by: {
            some: {
              user_id: userId as string // 명시적 타입 캐스팅
            }
          }
        }
      },
      select: {
        id: true
      }
    });

    if (unreadMessages.length === 0) {
      return NextResponse.json({ message: '읽지 않은 메시지가 없습니다.' }, { status: 200 });
    }

    // 2. 각 메시지에 대한 읽음 처리 (bi_message_read_by 테이블)
    const messageReadByData = unreadMessages.map(msg => ({
      message_id: msg.id,
      user_id: userId as string // 명시적 타입 캐스팅
    }));

    await prisma.bi_message_read_by.createMany({
      data: messageReadByData,
      skipDuplicates: true // 이미 존재하는 경우 스킵
    });

    // 3. 채팅방 단위 읽음 처리 (bi_message_read 테이블)
    // 가장 최근 메시지를 기준으로 채팅방 전체 읽음 처리
    const latestMessage = await prisma.bi_message.findFirst({
      where: {
        chat_room_id: roomId
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true
      }
    });

    if (latestMessage) {
      await prisma.bi_message_read.upsert({
        where: {
          message_id_user_id: {
            message_id: latestMessage.id,
            user_id: userId as string
          }
        },
        update: {
          read_at: new Date()
        },
        create: {
          message_id: latestMessage.id,
          user_id: userId as string,
          chat_room_id: roomId
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      count: unreadMessages.length 
    }, { status: 200 });
    
  } catch (error) {
    console.error('메시지 읽음 처리 오류:', error);
    return NextResponse.json({ 
      message: '서버 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}