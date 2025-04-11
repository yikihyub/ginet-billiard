import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const evaluator_id = session.user.mb_id!;
    const body = await req.json();
    
    // 필수 값 유효성 체크
    const {
      match_id,
      target_id,
      overall_satisfaction,
      play_time,
      game_type,
      high_run,
      manner_category,
      rules_category,
      time_category,
      skill_level_category,
      comment,
      is_anonymous = false, // 기본값 처리
       match_result, 
    } = body;
    
    const match_Id = Number(match_id);

    if (
      typeof match_Id !== 'number' ||
      typeof target_id !== 'string' ||
      !['under20min', '20to30min', '30to1hours', 'over1hours'].includes(play_time) ||
      !['3ball', '4ball', 'pocket'].includes(game_type) ||
      typeof match_result !== 'string'
    ) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.' },
        { status: 400 }
      );
    }

    // match 존재 확인
    const match = await prisma.bi_match.findUnique({
      where: { match_id: match_Id },
    });

    if (!match) {
      return NextResponse.json(
        { error: '존재하지 않는 매치입니다.' },
        { status: 404 }
      );
    }

    // 사용자와 대상자 참여 여부 및 자기 자신 평가 여부 확인
    const isParticipant = match.player1_id === evaluator_id || match.player2_id === evaluator_id;
    if (!isParticipant) {
      return NextResponse.json(
        { error: '이 매치의 참가자만 평가할 수 있습니다.' },
        { status: 403 }
      );
    }

    const isTargetParticipant = match.player1_id === target_id || match.player2_id === target_id;
    if (!isTargetParticipant) {
      return NextResponse.json(
        { error: '이 매치의 참가자만 평가 대상이 될 수 있습니다.' },
        { status: 403 }
      );
    }

    if (evaluator_id === target_id) {
      return NextResponse.json(
        { error: '자기 자신을 평가할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 중복 평가 확인
    const existingEvaluation = await prisma.bi_match_evaluation.findFirst({
      where: {
        match_id: match_Id,
        evaluator_id,
        target_id,
      },
    });

    if (existingEvaluation) {
      return NextResponse.json(
        { error: '이미 평가를 작성하셨습니다.' },
        { status: 400 }
      );
    }

    // 평가 생성 - 매치 상태는 변경하지 않음
    const evaluation = await prisma.bi_match_evaluation.create({
      data: {
        match_id: match_Id,
        evaluator_id,
        target_id,
        overall_satisfaction,
        play_time,
        game_type,
        high_run: typeof high_run === 'number' ? high_run : null,
        manner_category: typeof manner_category === 'string' ? manner_category : null,
        rules_category: typeof rules_category === 'string' ? rules_category : null,
        time_category: typeof time_category === 'string' ? time_category : null,
        skill_level_category: typeof skill_level_category === 'string' ? skill_level_category : null,
        comment: typeof comment === 'string' ? comment : null,
        is_anonymous: !!is_anonymous,
        winner_id: match_result,
      },
    });

    return NextResponse.json(
      { message: '평가가 성공적으로 등록되었습니다.', data: evaluation },
      { status: 201 }
    );
  } catch (error) {
    console.error('평가 등록 중 오류 발생:', error);
    return NextResponse.json(
      { error: '평가 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}