import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const mbId = userId;

    if (!mbId) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다.' },
        { status: 400 }
      );
    }

    // mb_id로 내부 id 찾기
    const user = await prisma.user.findUnique({
      where: { mb_id: mbId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // URL에서 쿼리 파라미터 추출
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // 카테고리에 따른 타입 매핑
    let typeCondition = {};
    if (category) {
      let types: string[] = [];
      switch (category) {
        case '매칭':
          types = [
            'match_request',
            'match_sent',
            'match_accepted',
            'match_rejected',
          ];
          break;
        case '활동・소식':
          types = ['system', 'activity', 'notification'];
          break;
        case '혜택・이벤트':
          types = ['event', 'promotion', 'benefit'];
          break;
      }

      if (types.length > 0) {
        typeCondition = { type: { in: types } };
      }
    }



    // 알림 목록 조회 (최신순)
    const alerts = await prisma.bi_alert.findMany({
      where: {
        user_id: user.id,
        ...(status ? { status } : {}),
        ...typeCondition,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: offset,
      take: limit,
    });
    
    // 안읽은 알림 수 조회
    const unreadCount = await prisma.bi_alert.count({
      where: {
        user_id: user.id,
        status: 'unread',
      },
    });

    return NextResponse.json({
      alerts,
      unreadCount,
      success: true,
    });
  } catch (error) {
    console.error('알림 조회 중 오류:', error);
    return NextResponse.json(
      { error: '알림 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
