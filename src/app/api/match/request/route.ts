import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { error: '요청 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.player1_id || !body.player2_id || !body.preferred_date) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const {
      player1_id,
      player2_id,
      preferred_date,
      message,
      game_type,
      location,
    } = body;

    // 트랜잭션 사용하여 두 테이블에 동시에 데이터 삽입
    const result = await prisma.$transaction(async (prisma) => {
      // 1. bi_match 테이블에 매치 생성
      const match = await prisma.bi_match.create({
        data: {
          player1_id: player1_id,
          player2_id: player2_id,
          preferred_date: new Date(preferred_date).toISOString(),
          game_type: game_type || null,
          location: location || null,
          match_status: 'PENDING',
        },
      });

      // 2. bi_match_request 테이블에 요청 생성
      const matchRequest = await prisma.bi_match_request.create({
        data: {
          match_id: match.match_id,
          requester_id: player1_id,
          recipient_id: player2_id,
          request_status: 'PENDING',
          request_date: new Date(),
          preferred_date: new Date(preferred_date).toISOString(),
          message: message,
          game_type: game_type || null,
          location: location || null,
          is_notified: false,
        },
      });

      return { match, matchRequest };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('매칭 신청 오류:', error);
    return NextResponse.json(
      { error: '매칭 신청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
