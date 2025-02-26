import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const player1_id = searchParams.get('player1_id');
    const player2_id = searchParams.get('player2_id');

    if (!player1_id || !player2_id) {
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
              { player1_id, player2_id },
              { player1_id: player2_id, player2_id: player1_id },
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

    return NextResponse.json({ existingMatch });
  } catch (error) {
    console.error('매치 상태 확인 오류:', error);
    return NextResponse.json(
      { error: '매치 상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
