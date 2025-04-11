import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const matchId = Number((await params).id);
    
    if (!matchId) {
      return NextResponse.json(
        { error: '매치 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 매치 정보 조회 (bi_match_request 테이블의 추가 정보도 함께 가져옴)
    const match = await prisma.bi_match.findUnique({
      where: { match_id: matchId },
      include: {
        bi_match_request: {
          orderBy: {
            request_date: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: '매치를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 요청자(player1) 정보 조회
    const requester = await prisma.user.findUnique({
      where: { mb_id: match.player1_id! },
      select: {
        id: true,
        mb_id: true,
        name: true,
        bi_level: true,
        user_three_ability: true,
        user_four_ability: true,
      },
    });
    
    const matchData = {
      ...match,
      message: match.bi_match_request[0]?.message || null,
      location: match.location || match.bi_match_request[0]?.location || null,
      requester: requester || null,
    };

    const { ...cleanMatchDetails } = matchData;

    return NextResponse.json({
      success: true,
      match: cleanMatchDetails,
    });
  } catch (error) {
    console.error('매치 상세 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '매치 상세 정보를 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}