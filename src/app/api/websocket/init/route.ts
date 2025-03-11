import { NextResponse } from 'next/server';
import {
  initWebSocketServer,
  getWebSocketServer,
} from '@/lib/websocket-server';

export async function GET() {
  // 이미 WebSocket 서버가 실행 중인지 확인
  const existingWss = getWebSocketServer();
  if (existingWss) {
    console.log('WebSocket 서버가 이미 실행 중입니다');
    return NextResponse.json({
      message: 'WebSocket 서버가 이미 실행 중입니다',
    });
  }

  try {
    // WebSocket 서버 초기화
    await initWebSocketServer();
    console.log('WebSocket 서버가 시작되었습니다');

    return NextResponse.json({
      message: 'WebSocket 서버가 시작되었습니다',
      status: 'success',
    });
  } catch (error) {
    console.error('WebSocket 서버 설정 오류:', error);
    return NextResponse.json(
      {
        error: 'WebSocket 서버를 시작하는 중 오류가 발생했습니다',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
