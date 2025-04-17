import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getKSTDate } from '@/utils/time';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status'); 

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const now = getKSTDate();
    
    // 기준 시간 계산
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // 1. 24시간 응답 없음으로 취소
    await prisma.bi_match.updateMany({
      where: {
        match_status: 'PENDING',
        request_date: { lt: oneDayAgo },
      },
      data: {
        request_status: 'CANCELLED',
        match_status: 'CANCELLED',
        cancel_reason: '24시간 응답 없음으로 자동 취소되었습니다.',
      },
    });

    // 2. preferred_date가 현재 시간보다 과거인 경우 취소
    await prisma.bi_match.updateMany({
      where: {
        match_status: 'PENDING',
        preferred_date: { lt: new Date() },
      },
      data: {
        request_status: 'CANCELLED',
        match_status: 'CANCELLED',
        cancel_reason: '요청한 시간이 지나 자동으로 취소되었습니다.',
      },
    });

    // 3. 만약 ACCEPTED 상태의 매치가 존재한다면
    const acceptedMatch = await prisma.bi_match.findFirst({
      where: {
        player1_id: userId,
        match_status: {
          in: ['ACCEPTED', 'IN_PROGRESS'],
        },
      },
    });

    if (acceptedMatch) {
      // PENDING 상태인 다른 매치들을 자동 취소
      await prisma.bi_match.updateMany({
        where: {
          player1_id: userId,
          match_status: 'PENDING',
        },
        data: {
          match_status: 'CANCELLED',
          request_status: 'CANCELLED',
          cancel_reason: '다른 매치가 이미 수락되어 자동 취소되었습니다.',
        },
      });
    }

    let statusFilter: any = {};

    if (status) {
      if (status !== 'all') {
        statusFilter = { match_status: status };
      }

      if (status === 'ACCEPTED') {
        statusFilter = { 
          match_status: { 
            in: ['PENDING', 'ACCEPTED'] 
          } 
        };
      } else if (status === 'IN_PROGRESS') {
        statusFilter = { 
          match_status: 'IN_PROGRESS' 
        };
      } else if (status === 'COMPLETED') {
        statusFilter = { 
          match_status: { 
            in: ['COMPLETED', 'EVALUATE'] 
          } 
        };
      }
    }

    // 내가 참여한 모든 매치 조회 (player1 또는 player2로 참여)
    const matches = await prisma.bi_match.findMany({
      where: {
        OR: [{ player1_id: userId }, { player2_id: userId }],
        ...statusFilter, // 상태 필터 적용
      },
      orderBy: {
        match_date: 'desc',
      },
      include: {
        bi_user_bi_match_player1_idTobi_user: {
          select: {
            name: true,
            user_three_ability: true,
            user_four_ability: true,
            profile_image: true,
          },
        },
        bi_user_bi_match_player2_idTobi_user: {
          select: {
            name: true,
            user_three_ability: true,
            user_four_ability: true,
            profile_image: true,
          },
        },
        // 당구장 정보 추가 (Prisma의 관계를 활용)
        bi_store: {
          select: {
            id: true,
            name: true,
            address: true,
            coord_x: true,
            coord_y: true,
          }
        },
      },
    });

    // 사용자가 평가한 매치 목록 가져오기
    const userEvaluations = await prisma.bi_match_evaluation.findMany({
      where: {
        evaluator_id: userId,
      },
      select: {
        match_id: true,
      }
    });

    // 사용자가 평가한 매치 ID 집합 생성
    const evaluatedMatchIds = new Set(
      userEvaluations.map(evaluation => evaluation.match_id)
    );

    // 클라이언트에 필요한 형식으로 데이터 가공
    const formattedMatches = await Promise.all(matches.map(async (match: any) => {
      const player1 = match.bi_user_bi_match_player1_idTobi_user;
      const player2 = match.bi_user_bi_match_player2_idTobi_user;
      const store = match.bi_store;

      // 해당 매치에 대한 현재 사용자의 평가 여부 확인
      const has_rated = evaluatedMatchIds.has(match.match_id);
      
      // 상대방의 평가 여부 확인 (선택적)
      const opponent_id = match.player1_id === userId ? match.player2_id : match.player1_id;
      const opponentEvaluation = await prisma.bi_match_evaluation.findFirst({
        where: {
          match_id: match.match_id,
          evaluator_id: opponent_id
        }
      });
      
      const opponent_has_rated = !!opponentEvaluation;

      return {
        match_id: match.match_id,
        match_date: match.match_date,
        match_status: match.match_status,
        match_type: match.match_status,
        game_type: match.game_type,

        // 당구장 정보를 venue 객체로 추가
        venue: store ? {
          id: store.id,
          name: store.name,
          address: store.address,
          longitude: store.coord_x,  // coord_x는 경도(longitude)로 매핑
          latitude: store.coord_y    // coord_y는 위도(latitude)로 매핑
        } : null,

        player1_id: match.player1_id,
        player1_name: player1?.name,
        player1_dama:
          match.game_type === 'THREE_BALL'
            ? player1?.user_three_ability
            : player1?.user_four_ability,
        player1_image: player1?.profile_image,
        player1_score: match.player1_score,

        player2_id: match.player2_id,
        player2_name: player2?.name,
        player2_dama:
          match.game_type === 'THREE_BALL'
            ? player2?.user_three_ability
            : player2?.user_four_ability,
        player2_image: player2?.profile_image,
        player2_score: match.player2_score,

        winner_id: match.winner_id,
        loser_id: match.loser_id,
        preferred_date: match.preferred_date,
        
        // 평가 관련 정보 추가
        has_rated: has_rated,                 // 현재 사용자가 평가했는지 여부
        opponent_has_rated: opponent_has_rated, // 상대방이 평가했는지 여부
        both_rated: has_rated && opponent_has_rated // 양쪽 모두 평가했는지 여부
      };
    }));

    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error('내 매치 조회 오류:', error);
    return NextResponse.json(
      { error: '매치 목록을 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}