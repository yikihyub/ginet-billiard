import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, userId } = body;

    if (!matchId || !userId) {
      return NextResponse.json(
        { error: '필수 매개변수가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 매치 정보 조회
    const match = await prisma.bi_match.findUnique({
      where: { match_id: matchId }
    });

    if (!match) {
      return NextResponse.json(
        { error: '매치를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 요청자가 매치 참가자인지 확인
    if (match.player1_id !== userId && match.player2_id !== userId) {
      return NextResponse.json(
        { error: '해당 매치에 대한 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 매치 상태가 IN_PROGRESS인지 확인
    if (match.match_status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: '진행 중인 매치만 종료할 수 있습니다.' },
        { status: 400 }
      );
    }

    // 매치 상태 업데이트
    const updatedMatch = await prisma.bi_match.update({
      where: { match_id: matchId },
      data: { match_status: 'COMPLETED' }
    });

    return NextResponse.json({
      success: true,
      match: updatedMatch
    });
  } catch (error) {
    console.error('매치 종료 처리 오류:', error);
    return NextResponse.json(
      { error: '매치 종료 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}