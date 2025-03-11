import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';

const prisma = new PrismaClient();

export async function POST() {
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

    // 2. 사용자 푸시 정보 삭제
    await prisma.user.update({
      where: { id: userId },
      data: {
        push_enabled: false,
        push_endpoint: null,
        push_p256dh: null,
        push_auth: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: '웹 푸시 알림이 비활성화되었습니다.',
    });
  } catch (error: any) {
    console.error('푸시 알림 비활성화 중 오류 발생:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
