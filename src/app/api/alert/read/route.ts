import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { alertId } = await request.json();

    if (!alertId) {
      return NextResponse.json(
        { error: '알림 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 알림을 읽음 상태로 업데이트
    const alert = await prisma.bi_alert.update({
      where: { id: alertId },
      data: {
        status: 'read',
        read_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: '알림이 읽음 상태로 업데이트되었습니다.',
      alert,
    });
  } catch (error) {
    console.error('알림 상태 업데이트 중 오류:', error);
    return NextResponse.json(
      { error: '알림 상태 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
