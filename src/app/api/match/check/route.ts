import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 매치 평가 제출
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      match_id,
      evaluator_id,
      target_id,
      manner_rating,
      skill_rating,
      skill_accuracy_rating,
      comment,
      is_anonymous,
    } = body;

    const evaluation = await prisma.bi_match_evaluation.create({
      data: {
        match_id,
        evaluator_id,
        target_id,
        manner_rating,
        skill_rating,
        skill_accuracy_rating,
        comment,
        is_anonymous,
      },
    });

    return NextResponse.json({ success: true, data: evaluation });
  } catch (error) {
    console.error('매치 평가 제출 오류:', error);
    return NextResponse.json(
      { error: '매치 평가 제출 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
