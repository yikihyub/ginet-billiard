import { NextRequest, NextResponse } from 'next/server';
import { saveMessage } from '@/lib/chat-service';

// HTTP 요청을 통해 메시지 저장을 테스트하기 위한 엔드포인트
// 실제 메시지는 WebSocket을 통해 처리됨
export async function POST(req: NextRequest) {
  try {
    const messageData = await req.json();

    if (!messageData.senderId || !messageData.content || !messageData.roomId) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다' },
        { status: 400 }
      );
    }

    // 메시지 저장
    const messageId = await saveMessage({
      type: 'message',
      senderId: messageData.senderId,
      content: messageData.content,
      roomId: messageData.roomId,
      timestamp: messageData.timestamp || Date.now(),
    });

    return NextResponse.json({
      id: messageId,
      message: '메시지가 성공적으로 저장되었습니다',
    });
  } catch (error) {
    console.error('메시지 저장 중 오류 발생:', error);

    return NextResponse.json(
      { error: '메시지 처리 중 오류가 발생했습니다', details: String(error) },
      { status: 500 }
    );
  }
}
