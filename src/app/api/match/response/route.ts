// src/app/api/match/response/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { matchId, response, userId } = await request.json();

    if (!matchId || !response || !userId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 매치 정보 조회
    const match = await prisma.bi_match.findUnique({
      where: { match_id: matchId },
    });

    if (!match) {
      return NextResponse.json(
        { error: '매치를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 권한 확인 (요청받은 사용자만 응답 가능)
    if (match.player2_id !== userId) {
      return NextResponse.json(
        { error: '이 매치에 대한 응답 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 트랜잭션으로 여러 테이블을 함께 업데이트
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. bi_match 테이블 업데이트
      const updatedMatch = await tx.bi_match.update({
        where: { match_id: matchId },
        data: {
          match_status: response === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED',
          request_status: response === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED',
          response_date: new Date(),
        },
      });

      // 2. 요청자의 user.id 조회
      const requester = await tx.user.findUnique({
        where: { mb_id: match.player1_id || '' },
        select: { id: true, name: true },
      });

      if (!requester) {
        throw new Error('요청자 정보를 찾을 수 없습니다.');
      }

      // 3. 알림 생성 (요청자에게)
      const alert = await tx.bi_alert.create({
        data: {
          user_id: requester.id,
          title: response === 'ACCEPT' ? '매치 수락됨' : '매치 거절됨',
          message:
            response === 'ACCEPT'
              ? `${userId}님이 매치 요청을 수락했습니다.`
              : `${userId}님이 매치 요청을 거절했습니다.`,
          type: response === 'ACCEPT' ? 'MATCH_ACCEPTED' : 'MATCH_REJECTED',
          status: 'unread',
          category: 'match',
          data: {
            matchId: matchId,
            gameType: match.game_type,
            opponentId: userId,
          },
        },
      });

      return { match: updatedMatch, alert };
    });

    return NextResponse.json(result.match);
  } catch (error) {
    console.error('매치 응답 처리 오류:', error);
    return NextResponse.json(
      { error: '매치 응답 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
