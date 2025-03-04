import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = Number(searchParams.get('userId'));

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 2. 사용자 푸시 구독 정보 가져오기
    const userPushSubscription = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        push_enabled: true,
        push_endpoint: true,
        push_p256dh: true,
        push_auth: true,
      },
    });

    if (!userPushSubscription) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log(userPushSubscription);

    return NextResponse.json({
      success: true,
      data: userPushSubscription,
    });
  } catch (error: any) {
    console.error('푸시 알림 정보 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
