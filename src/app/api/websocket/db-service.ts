import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { ChatMessage } from '@/types/(chat)/chat';

/**
 * 채팅 메시지를 데이터베이스에 저장
 */
export async function saveMessage(message: ChatMessage): Promise<string> {
  try {
    const { senderId, content, roomId, timestamp } = message;
    console.log('메시지 저장 시도:', { senderId, content, roomId, timestamp });

    // UUID 생성
    const messageId = uuidv4();
    console.log('생성된 messageId:', messageId);

    // DB에 메시지 저장
    const savedMessage = await prisma.bi_message.create({
      data: {
        id: messageId,
        content: content || '',
        sender_id: senderId,
        chat_room_id: roomId || '',
        created_at: new Date(timestamp || Date.now()),
      },
    });

    console.log('메시지 저장 성공:', savedMessage);
    return messageId;
  } catch (error) {
    console.error('메시지 저장 중 오류 발생 (상세):', error);
    // 에러 객체 구조 로깅
    console.error('에러 타입:', typeof error);
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
    } else {
      console.error('알 수 없는 에러 형식:', error);
    }
    throw error;
  }
}

/**
 * 메시지를 읽음으로 표시
 */
export async function markMessageAsRead(
  messageId: string,
  userId: string,
  roomId: string
): Promise<boolean> {
  try {
    console.log('메시지 읽음 표시 시도:', { messageId, userId, roomId });

    // 읽음 표시 레코드가 이미 있는지 확인
    const existingRead = await prisma.bi_message_read.findFirst({
      where: {
        message_id: messageId,
        user_id: userId,
      },
    });

    // 이미 읽음 표시가 있으면 중복 생성하지 않음
    if (existingRead) {
      console.log('이미 읽음으로 표시되어 있습니다:', existingRead);
      return true;
    }

    // 새 읽음 표시 생성
    const readRecord = await prisma.bi_message_read.create({
      data: {
        id: uuidv4(),
        message_id: messageId,
        user_id: userId,
        chat_room_id: roomId,
        read_at: new Date(),
      },
    });

    console.log('읽음 표시 성공:', readRecord);
    return true;
  } catch (error) {
    console.error('읽음 표시 중 오류 발생:', error);
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message);
    }
    throw error;
  }
}

/**
 * 채팅방의 메시지 목록 조회
 */
export async function getChatRoomMessages(
  roomId: string,
  limit = 50,
  offset = 0
) {
  try {
    const messages = await prisma.bi_message.findMany({
      where: {
        chat_room_id: roomId,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        bi_user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return messages.reverse(); // 시간순으로 정렬
  } catch (error) {
    console.error('채팅방 메시지 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 읽지 않은 메시지 개수 조회
 */
export async function getUnreadMessageCount(userId: string, roomId: string) {
  try {
    // 해당 채팅방의 전체 메시지 수
    const totalMessages = await prisma.bi_message.count({
      where: {
        chat_room_id: roomId,
      },
    });

    // 읽은 메시지 수
    const readMessages = await prisma.bi_message_read.count({
      where: {
        user_id: userId,
        chat_room_id: roomId,
      },
    });

    return Math.max(0, totalMessages - readMessages);
  } catch (error) {
    console.error('읽지 않은 메시지 개수 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 채팅방 정보 조회
 */
export async function getChatRoomInfo(roomId: string) {
  try {
    // 여기서는 비즈니스 로직에 맞는 채팅방 정보 조회 쿼리를 구현
    // 예시로 간단한 조회만 구현
    const chatRoom = await prisma.bi_chat_room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        bi_chat_room_participants: true,
      },
    });

    return chatRoom;
  } catch (error) {
    console.error('채팅방 정보 조회 중 오류 발생:', error);
    throw error;
  }
}
