import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = parseInt(searchParams.get('matchId') || '');
    const { playerInfo } = await request.json();

    // 1. 매치 정보 조회
    const match = await prisma.bi_match_reg.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json(
        { message: '매치를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (match.current_players >= match.player_count) {
      return NextResponse.json(
        { message: '이미 정원이 찼습니다.' },
        { status: 400 }
      );
    }

    // 2. 유저 검색
    const user = await prisma.user.findFirst({
      where: { phonenum: playerInfo.phone },
    });

    if (!user) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 3. 팀 배정
    const team =
      match.match_type === 'ONE_VS_ONE'
        ? 2
        : Math.ceil(match.current_players / 2) + 1;

    // 4. 트랜잭션으로 참가자 등록 및 매치 정보 업데이트
    const updatedMatch = await prisma.$transaction(async (tx) => {
      // 참가자 등록
      await tx.bi_match_participant.create({
        data: {
          match_id: matchId,
          user_id: user.id,
          team,
        },
      });

      // 매치 정보 업데이트
      return tx.bi_match_reg.update({
        where: { id: matchId },
        data: {
          current_players: match.current_players + 1,
          status:
            match.current_players + 1 >= match.player_count
              ? 'ACCEPTED'
              : 'PENDING',
        },
        include: {
          bi_user: true,
          bi_match_participant: {
            include: {
              bi_user: true,
            },
          },
        },
      });
    });

    return NextResponse.json(updatedMatch);
  } catch (error) {
    console.error('Failed to join match:', error);
    return NextResponse.json(
      { message: '매치 참가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
