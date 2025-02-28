import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// API 수정 부분 (status API)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const currentUserId = searchParams.get('currentUserId'); // 현재 로그인한 사용자
    const otherUserId = searchParams.get('otherUserId'); // 카드에 표시된 사용자

    if (!currentUserId || !otherUserId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 현재 진행 중인 매치 확인
    const existingMatch = await prisma.bi_match.findFirst({
      where: {
        AND: [
          {
            OR: [
              { player1_id: currentUserId, player2_id: otherUserId },
              { player1_id: otherUserId, player2_id: currentUserId },
            ],
          },
          {
            match_status: {
              in: [
                'PENDING',
                'ACCEPTED',
                'IN_PROGRESS',
                'COMPLETED',
                'EVALUATE',
              ],
            },
          },
        ],
      },
      orderBy: {
        match_date: 'desc',
      },
    });

    // 중요: 사용자의 역할 정보 추가
    return NextResponse.json({
      existingMatch,
      isRequester: existingMatch
        ? existingMatch.player1_id === currentUserId
        : false,
    });
  } catch (error) {
    console.error('매치 상태 확인 오류:', error);
    return NextResponse.json(
      { error: '매치 상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
