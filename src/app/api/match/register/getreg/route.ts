import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. 매치 정보만 가져오기
    const matches = await prisma.bi_match_reg.findMany({
      where: { status: 'PENDING' },
      include: {
        bi_user: true,
      },
    });

    // 2. 관련 참가자 목록 모두 가져오기
    const participants = await prisma.bi_match_participant.findMany({
      where: {
        match_id: {
          in: matches.map((match) => match.id),
        },
      },
      include: {
        bi_user: true,
      },
    });

    // 3. matchId 기준으로 참가자 붙이기
    const result = matches.map((match) => ({
      ...match,
      participants: participants.filter((p) => p.match_id === match.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return NextResponse.json(
      { message: '매치 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
