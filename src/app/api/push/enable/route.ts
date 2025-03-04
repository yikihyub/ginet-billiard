import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';

export async function POST(req: NextRequest) {
  try {
    // 1. 사용자 인증 확인
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // 2. 요청 데이터 확인 (브라우저 푸시 구독 정보)
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: '유효하지 않은 구독 데이터입니다.' },
        { status: 400 }
      );
    }

    // 3. 사용자 정보 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: {
        push_enabled: true,
        push_endpoint: subscription.endpoint,
        push_p256dh: subscription.keys.p256dh,
        push_auth: subscription.keys.auth,
      },
    });

    return NextResponse.json({
      success: true,
      message: '웹 푸시 알림이 활성화되었습니다.',
    });
  } catch (error: any) {
    console.error('푸시 알림 활성화 중 오류 발생:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
