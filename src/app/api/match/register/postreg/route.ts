import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CreateMatchDTO, MatchResponse } from '@/types/(match)';

export async function POST(request: Request) {
  try {
    const body: CreateMatchDTO = await request.json();
    const { matchType, gameType, playerInfo, userId, preferredDate } = body;

    // 1. 유저 검색 또는 생성
    const user = await prisma.user.findFirst({
      where: {
        mb_id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 2. 매치 생성
    const playerCount = matchType === 'ONE_VS_ONE' ? 2 : 4;
    const match = await prisma.bi_match_reg.create({
      data: {
        match_type: matchType,
        match_date: preferredDate,
        game_type: gameType,
        creator_id: user.id,
        player_count: playerCount,
        current_players: 1,
        status: 'PENDING',
        billiard_place: playerInfo.storeAddress,
      },
    });

    // 3. 매치 참가자 등록
    await prisma.bi_match_participant.create({
      data: {
        match_id: match.id,
        user_id: user.id,
        team: 1,
      },
    });

    // 4. 응답 데이터 구성
    const response: MatchResponse = {
      id: match.id,
      matchType,
      gameType,
      status: match.status,
      playerCount,
      currentPlayers: 1,
      participants: [
        {
          id: user.id,
          name: user.name,
          handicap: user.user_three_ability,
          team: 1,
        },
      ],
      createdAt: match.created_at,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Match creation failed:', error);
    return NextResponse.json(
      { message: '매치 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
