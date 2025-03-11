import { NextRequest, NextResponse } from 'next/server';
// import { markMessageAsRead } from '@/lib/chat-service';

export async function POST(req: NextRequest) {
  try {
    const readData = await req.json();

    if (!readData.messageId || !readData.userId || !readData.roomId) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다' },
        { status: 400 }
      );
    }

    // 메시지 읽음 표시 처리
    // const result = await markMessageAsRead(
    //   readData.messageId,
    //   readData.userId,
    //   readData.roomId
    // );

    return NextResponse.json({
      success: true,
      message: '메시지 읽음 표시가 처리되었습니다',
    });
  } catch (error) {
    console.error('읽음 표시 처리 중 오류 발생:', error);

    return NextResponse.json(
      {
        error: '읽음 표시 처리 중 오류가 발생했습니다',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
