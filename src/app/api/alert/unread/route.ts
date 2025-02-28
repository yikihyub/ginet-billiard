import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // 읽지 않은 알림 조회 (읽음 처리는 하지 않음)
    const unreadNotifications = await prisma.bi_alert.findMany({
      where: {
        user_id: userId,
        status: 'unread',
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10, // 최신 10개만 가져오기
    });

    return NextResponse.json({
      notifications: unreadNotifications.map((notification) => ({
        id: notification.id,
        type: notification.type || 'general',
        title: notification.title,
        message: notification.message,
        category: notification.category || 'general',
        data: notification.data || null,
        createdAt: notification.created_at,
      })),
    });
  } catch (error) {
    console.error('알림 조회 오류:', error);
    return NextResponse.json(
      { error: '알림 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
