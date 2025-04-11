import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchid: string }> }
) {
  try {
    const matchId = Number((await params).matchid);
    
    if (!matchId || isNaN(matchId)) {
      return NextResponse.json(
        { error: '유효한 매치 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 특정 매치 ID로 정보 조회
    const match = await prisma.bi_match.findUnique({
      where: {
        match_id: matchId,
      },
      include: {
        bi_user_bi_match_player1_idTobi_user: {
          select: {
            mb_id: true,
            name: true,
            user_three_ability: true,
            user_four_ability: true,
            profile_image: true,
          },
        },
        bi_user_bi_match_player2_idTobi_user: {
          select: {
            mb_id: true,
            name: true,
            user_three_ability: true,
            user_four_ability: true,
            profile_image: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: '존재하지 않는 매치입니다.' },
        { status: 404 }
      );
    }

    // 클라이언트에 필요한 형식으로 데이터 가공
    const player1 = match.bi_user_bi_match_player1_idTobi_user;
    const player2 = match.bi_user_bi_match_player2_idTobi_user;

    const formattedMatch = {
      match_id: match.match_id,
      match_date: match.match_date,
      match_status: match.match_status,
      match_type: match.match_status,
      game_type: match.game_type,
      location: match.location,

      player1_id: match.player1_id,
      player1_name: player1?.name,
      player1_mb_id: player1?.mb_id,
      player1_dama:
        match.game_type === 'THREE_BALL'
          ? player1?.user_three_ability
          : player1?.user_four_ability,
      player1_image: player1?.profile_image,
      player1_score: match.player1_score,

      player2_id: match.player2_id,
      player2_name: player2?.name,
      player2_mb_id: player2?.mb_id,
      player2_dama:
        match.game_type === 'THREE_BALL'
          ? player2?.user_three_ability
          : player2?.user_four_ability,
      player2_image: player2?.profile_image,
      player2_score: match.player2_score,

      winner_id: match.winner_id,
      loser_id: match.loser_id,
    };

    return NextResponse.json(formattedMatch);
  } catch (error) {
    console.error('매치 조회 오류:', error);
    return NextResponse.json(
      { error: '매치 정보를 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}