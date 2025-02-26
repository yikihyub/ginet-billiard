import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { userId } = await request.json();

    // 사용자의 모든 알림을 읽음 상태로 업데이트
    const updateResult = await prisma.bi_alert.updateMany({
      where: {
        user_id: userId,
        status: 'unread',
      },
      data: {
        status: 'read',
        read_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: '모든 알림이 읽음 상태로 업데이트되었습니다.',
      updatedCount: updateResult.count,
    });
  } catch (error) {
    console.error('알림 일괄 업데이트 중 오류:', error);
    return NextResponse.json(
      { error: '알림 일괄 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
