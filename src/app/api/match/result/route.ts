import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 매치 결과 제출
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      match_id,
      submitter_id,
      winner_id,
      loser_id,
      winner_score,
      loser_score,
      game_duration,
    } = body;

    // 매치가 존재하는지 확인
    const match = await prisma.bi_match.findUnique({
      where: { match_id: match_id },
    });

    if (!match) {
      return NextResponse.json(
        { error: '존재하지 않는 매치입니다.' },
        { status: 404 }
      );
    }

    // 이미 결과가 제출되었는지 확인
    const existingResult = await prisma.bi_match_result.findFirst({
      where: { match_id: match_id },
    });

    if (existingResult) {
      // 상대방이 이미 제출한 경우
      const updatedResult = await prisma.bi_match_result.update({
        where: { result_id: existingResult.result_id },
        data: {
          [`player${submitter_id === existingResult.winner_id ? '1' : '2'}_confirm`]:
            true,
          // 결과가 일치하는지 확인
          status:
            existingResult.winner_id === winner_id &&
            existingResult.loser_id === loser_id &&
            existingResult.winner_score === winner_score &&
            existingResult.loser_score === loser_score
              ? 'CONFIRMED'
              : 'DISPUTED',
          verified_by: 'PLAYERS',
          verified_at: new Date(),
        },
      });

      if (updatedResult.status === 'DISPUTED') {
        // 자동으로 분쟁 케이스 생성
        await prisma.bi_match_dispute.create({
          data: {
            match_id,
            reporter_id: submitter_id,
            dispute_type: 'SCORE_DISPUTE',
            description: '경기 결과 불일치',
            status: 'PENDING',
          },
        });
      }

      return NextResponse.json({ success: true, data: updatedResult });
    } else {
      // 첫 결과 제출
      const newResult = await prisma.bi_match_result.create({
        data: {
          match_id,
          winner_id,
          loser_id,
          winner_score,
          loser_score,
          game_duration,
          [`player${submitter_id === winner_id ? '1' : '2'}_confirm`]: true,
          status: 'PENDING',
          verified_by: 'PENDING',
        },
      });

      return NextResponse.json({ success: true, data: newResult });
    }
  } catch (error) {
    console.error('매치 결과 제출 오류:', error);
    return NextResponse.json(
      { error: '매치 결과 제출 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
