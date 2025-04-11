import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userName = searchParams.get('userName');
    
    if (!userName) {
      return NextResponse.json(
        { error: '사용자 이름이 필요합니다.' },
        { status: 400 }
      );
    }

    // 1. 먼저 userName으로 사용자의 mb_id 찾기
    const user = await prisma.user.findFirst({
      where: {
        name: userName
      },
      select: {
        mb_id: true,
        name: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '해당 이름의 사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 2. 찾은 mb_id로 평가 데이터 조회
    const evaluations = await prisma.bi_match_evaluation.findMany({
      where: {
        target_id: user.mb_id!
      },
      include: {
        bi_match: {
          select: {
            match_date: true,
            game_type: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // 평가자 정보 조회 (별도 쿼리)
    const evaluatorIds = evaluations.map(e => e.evaluator_id);
    const evaluators = await prisma.user.findMany({
      where: {
        mb_id: {
          in: evaluatorIds
        }
      },
      select: {
        mb_id: true,
        name: true,
        profile_image: true
      }
    });

    // 결과 변환
    const formattedReviews = evaluations.map(evaluation => {
      // 해당 평가의 평가자 찾기
      const evaluator = evaluators.find(e => e.mb_id === evaluation.evaluator_id);

      return {
        id: evaluation.evaluation_id,
        author: evaluation.is_anonymous ? '익명' : (evaluator?.name || '알 수 없음'),
        date: evaluation.created_at ? new Date(evaluation.created_at).toISOString().split('T')[0].replace(/-/g, '.') : '',
        rating: evaluation.overall_satisfaction ? parseInt(evaluation.overall_satisfaction) : 0,
        comment: evaluation.comment || '',
        game_type: evaluation.game_type || '',
        play_time: evaluation.play_time || '',
        highRun: evaluation.high_run,
        mannerCategory: evaluation.manner_category,
        rulesCategory: evaluation.rules_category,
        timeCategory: evaluation.time_category,
        skillLevelCategory: evaluation.skill_level_category,
        likes: 0,
        winner_id: evaluation.winner_id || '' // 승자 ID 추가
      };
    });

    return NextResponse.json({
      user: {
        mb_id: user.mb_id,
        name: user.name
      },
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error('평가 데이터 조회 오류:', error);
    return NextResponse.json(
      { error: '평가 데이터 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}