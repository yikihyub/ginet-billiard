import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

function parseUserAgent(userAgent: string) {
  const lowerUA = userAgent.toLowerCase();

  // OS 추정
  const os = /windows/.test(lowerUA)
    ? 'Windows'
    : /mac/.test(lowerUA)
    ? 'macOS'
    : /linux/.test(lowerUA)
    ? 'Linux'
    : /android/.test(lowerUA)
    ? 'Android'
    : /iphone|ipad/.test(lowerUA)
    ? 'iOS'
    : 'Unknown';

  // 브라우저 추정
  const browser = /chrome/.test(lowerUA)
    ? 'Chrome'
    : /safari/.test(lowerUA)
    ? 'Safari'
    : /firefox/.test(lowerUA)
    ? 'Firefox'
    : /edge/.test(lowerUA)
    ? 'Edge'
    : /msie|trident/.test(lowerUA)
    ? 'Internet Explorer'
    : 'Unknown';

  // 디바이스 타입 추정
  const deviceType = /mobile|android|iphone|ipad/.test(lowerUA)
    ? 'mobile'
    : 'desktop';

  return { os, browser, deviceType };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, referrer } = body;

    // 쿠키에서 세션 가져오기 or 생성
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) {
      sessionId = uuidv4();
    }

    const userAgentStr = req.headers.get('user-agent') || '';
    const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0';

        // user-agent 파싱
    const { os, browser, deviceType } = parseUserAgent(userAgentStr);

    await prisma.visit_logs.create({
      data: {
        session_id: sessionId,
        ip_address: ip,
        user_agent: userAgentStr,
        device_type: deviceType,
        browser: browser,
        os: os,
        referer_url: referrer || '',
        page_url: url || '',
        visit_time: new Date(),
        // user_id는 인증 연동 시 추가 가능
      },
    });

    const res = NextResponse.json({ success: true });
    return res;
  } catch (error) {
    console.error('Failed to log visit:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
