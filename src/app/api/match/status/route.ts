import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const currentUserId = searchParams.get('currentUserId'); // 현재 로그인한 사용자
    const otherUserId = searchParams.get('otherUserId'); // 카드에 표시된 사용자

    if (!currentUserId || !otherUserId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 기준 시간 계산
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

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

    // 현재 사용자가 보낸 활성 매칭 요청 수 체크
    const activeRequestsCount = await prisma.bi_match.count({
      where: {
        player1_id: currentUserId,
        match_status: 'PENDING',
      }
    });

    // 패널티 상태 확인
    const userPenalty = await prisma.bi_user_penalty.findFirst({
      where: {
        user_id: currentUserId,
        expires_at: { gt: new Date() }
      },
      orderBy: {
        expires_at: 'desc'
      }
    });
    const hasPenalty = !!userPenalty;

    // ACCEPTED 상태의 매치가 존재한다면
    const acceptedMatch = await prisma.bi_match.findFirst({
      where: {
        player1_id: currentUserId,
        match_status: {
          in: ['ACCEPTED', 'IN_PROGRESS'],
        },
      },
    });

    if (acceptedMatch) {
      // PENDING 상태인 다른 매치들을 자동 취소
      await prisma.bi_match.updateMany({
        where: {
          player1_id: currentUserId,
          match_status: 'PENDING',
        },
        data: {
          match_status: 'CANCELLED',
          request_status: 'CANCELLED',
          cancel_reason: '다른 매치가 이미 수락되어 자동 취소되었습니다.',
        },
      });
    }

    // 현재 사용자가 관련된 모든 진행 중인 매치 확인 (신규 매치 신청 가능 여부 확인용)
    const currentUserActiveMatches = await prisma.bi_match.findMany({
      where: {
        OR: [
          { player1_id: currentUserId },
          { player2_id: currentUserId },
        ],
        match_status: {
          in: ['ACCEPTED', 'IN_PROGRESS'],
        },
      },
    });

    const hasPendingMatches = currentUserActiveMatches.length > 0;

    // 미평가 완료된 경기가 있는지 확인 - 현재 사용자 기준
    const completedMatches = await prisma.bi_match.findMany({
      where: {
        OR: [
          { player1_id: currentUserId },
          { player2_id: currentUserId },
        ],
        match_status: 'COMPLETED',
      },
      include: {
        bi_match_evaluation: {
          where: {
            evaluator_id: currentUserId
          }
        }
      }
    });

    // 현재 사용자가 평가하지 않은 매치가 있는지 확인
    const hasUnratedMatches = completedMatches.some(match => 
      match.bi_match_evaluation.length === 0
    );

    // 현재 두 사용자 간의 진행 중인 매치 확인
    const existingMatch = await prisma.bi_match.findFirst({
      where: {
        AND: [
          {
            OR: [
              { player1_id: currentUserId, player2_id: otherUserId },
              { player1_id: otherUserId, player2_id: currentUserId },
            ],
          },
          {
            match_status: {
              in: [
                'PENDING',
                'ACCEPTED',
                'IN_PROGRESS',
                'COMPLETED',
                'EVALUATE',
              ],
            },
          },
        ],
      },
      orderBy: {
        match_date: 'desc',
      },
      include: {
        bi_match_evaluation: {
          where: {
            evaluator_id: currentUserId
          }
        }
      }
    });

    // 추가: 해당 otherUserId가 이미 다른 사람과 매치 중인지 확인
    const otherUserActiveMatch = await prisma.bi_match.findFirst({
      where: {
        OR: [
          { player1_id: otherUserId },
          { player2_id: otherUserId },
        ],
        match_status: {
          in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'],
        },
        NOT: {
          player1_id: currentUserId,
          player2_id: currentUserId,
        }
      },
      orderBy: {
        match_date: 'desc',
      }
    });

    let updatedMatch = existingMatch;
    let matchRole = 'NONE';
    let hasRated = false;
    // 제3자에게 보여줄 otherUserMatchStatus
    const otherUserMatchStatus = otherUserActiveMatch ? otherUserActiveMatch.match_status : 'NONE';

    // 매치 역할 결정 및 평가 여부 확인
    if (existingMatch) {
      if (existingMatch.player1_id === currentUserId) {
        matchRole = 'REQUESTER';
      } else if (existingMatch.player2_id === currentUserId) {
        matchRole = 'RECEIVER';
      } else {
        matchRole = 'OBSERVER';
      }

      // 현재 사용자의 평가 여부 확인
      hasRated = existingMatch.bi_match_evaluation.length > 0;

      // ACCEPTED 상태이고 매치 시작 시간이 있는 경우
      if (existingMatch.match_status === 'ACCEPTED' && existingMatch.preferred_date) {
        const matchDate = new Date(existingMatch.preferred_date);
        
        // 현재 시간이 매치 시작 시간 이후라면 IN_PROGRESS로 상태 변경
        if (new Date() >= matchDate) {
          await prisma.bi_match.update({
            where: { match_id: existingMatch.match_id },
            data: { match_status: 'IN_PROGRESS' }
          });
          
          // 업데이트된 상태로 다시 조회 (평가 정보 포함)
          updatedMatch = await prisma.bi_match.findUnique({
            where: { match_id: existingMatch.match_id },
            include: {
              bi_match_evaluation: {
                where: { evaluator_id: currentUserId }
              }
            }
          });
        }
      }
      // IN_PROGRESS 상태이고 매치 시작 후 3시간이 지났으면 COMPLETED로 변경
      else if (existingMatch.match_status === 'IN_PROGRESS' && existingMatch.preferred_date) {
        const matchDate = new Date(existingMatch.preferred_date);
        const twoHoursAfter = new Date(matchDate.getTime() + 3 * 60 * 60 * 1000);
        
        if (new Date() >= twoHoursAfter) {
          await prisma.bi_match.update({
            where: { match_id: existingMatch.match_id },
            data: { match_status: 'COMPLETED' }
          });
          
          // 업데이트된 상태로 다시 조회 (평가 정보 포함)
          updatedMatch = await prisma.bi_match.findUnique({
            where: { match_id: existingMatch.match_id },
            include: {
              bi_match_evaluation: {
                where: { evaluator_id: currentUserId }
              }
            }
          });
        }
      }
    }

    // 신규 매치 신청 가능 여부 결정:
    // 1. 이미 매치가 있으면 불가능
    // 2. 다른 진행 중 매치가 있으면 불가능
    // 3. 미평가 매치가 있으면 불가능
    // 4. 대상 사용자가 이미 다른 사람과 매치 중이면 불가능
    const canRequest = !existingMatch && !hasPendingMatches && !hasUnratedMatches && !otherUserActiveMatch;

    // 일관된 응답 형식으로 반환
    return NextResponse.json({
      existingMatch: updatedMatch,
      matchStatus: updatedMatch?.match_status || otherUserMatchStatus,
      matchRole,
      isRequester: matchRole === 'REQUESTER',
      canRequest,
      hasPendingMatches,
      hasUnratedMatches,
      matchId: updatedMatch?.match_id || null,
      hasRated, // 현재 사용자가 이 매치에 대해 평가를 완료했는지 여부
      activeRequestsCount,
      maxRequests: 3,
      hasPenalty,
      penaltyExpiresAt: userPenalty?.expires_at || null,
      // 제3자를 위한 추가 정보
      otherUserHasActiveMatch: !!otherUserActiveMatch,
      otherUserMatchStatus,
    });
  } catch (error) {
    console.error('매치 상태 확인 오류:', error);
    return NextResponse.json(
      { error: '매치 상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}