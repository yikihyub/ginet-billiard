// app/api/(superginet)/analytics/pageview/route.ts
import { NextRequest, NextResponse, userAgent } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const { url,  referrer, userId } = await request.json();
  
  // Next.js의 내장 userAgent 함수 사용
  const ua = userAgent(request);
  const session = request.cookies.get('session_id')?.value || crypto.randomUUID();
  const ip = request.headers.get('x-forwarded-for') || '';
  
  // 디바이스 정보 추출
  const deviceType = ua.device.type || 'desktop';
  const browser = ua.browser.name || 'unknown';
  const os = ua.os.name || 'unknown';
  
  try {
    // 먼저 세션이 이미 존재하는지 확인
    const existingSession = await prisma.user_sessions.findUnique({
      where: { session_id: session }
    });

    // 세션이 없으면 생성
    if (!existingSession) {
      await prisma.user_sessions.create({
        data: {
          session_id: session,
          user_id: userId || null,
          ip_address: ip,
          user_agent: request.headers.get('user-agent') || '',
          device_type: deviceType,
          start_time: new Date(),
          last_activity: new Date(),
          is_active: true
        }
      });
    } else {
      // 세션이 있으면 마지막 활동 시간 업데이트
      await prisma.user_sessions.update({
        where: { session_id: session },
        data: {
          last_activity: new Date(),
          is_active: true
        }
      });
    }
    
    // 방문 로그 생성
    await prisma.visit_logs.create({
      data: {
        session_id: session,
        user_id: userId || null,
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || '',
        device_type: deviceType,
        browser,
        os,
        referer_url: referrer,
        page_url: url,
        visit_time: new Date()
      }
    });
    
    // 세션 쿠키 설정
    const response = NextResponse.json({ success: true });
    
    if (!request.cookies.get('session_id')) {
      // 1년 유효 기간의 쿠키
      const oneYear = 60 * 60 * 24 * 365;
      response.cookies.set({
        name: 'session_id',
        value: session,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: oneYear
      });
    }
    
    return response;
  } catch (error) {
    console.error('Failed to log page view:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}