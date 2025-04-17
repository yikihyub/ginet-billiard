import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 지각 패널티 규칙 정의
const PENALTY_RULES = {
  LEVEL_1: {
    MIN_MINUTES: 0,
    MAX_MINUTES: 10,
    PENALTY_POINTS: 1,
    DESCRIPTION: "10분 이내 지각"
  },
  LEVEL_2: {
    MIN_MINUTES: 11,
    MAX_MINUTES: 20,
    PENALTY_POINTS: 2,
    DESCRIPTION: "10분 초과 ~ 20분 이내 지각"
  },
  LEVEL_3: {
    MIN_MINUTES: 20,
    MAX_MINUTES: Infinity,
    PENALTY_POINTS: 3,
    DESCRIPTION: "20분 초과 지각(노쇼와 동일)"
  }
};

// 누적 패널티에 따른 정지 기간 정의
const SUSPENSION_RULES = [
  { POINTS: 3, DAYS: 1, DESCRIPTION: "매치프로그램 1일 정지" },
  { POINTS: 6, DAYS: 3, DESCRIPTION: "매치프로그램 3일 정지" },
  { POINTS: 9, DAYS: 7, DESCRIPTION: "매치프로그램 7일 정지" },
  { POINTS: 10, DAYS: 30, DESCRIPTION: "매치프로그램 한달 정지" }
];

export async function POST(request: NextRequest) {
  try {
    const { matchId, userId } = await request.json();
    
    if (!matchId || !userId) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 1. 매치 정보 확인
    const match = await prisma.bi_match.findUnique({
      where: { match_id: matchId }
    });
    
    if (!match) {
      return NextResponse.json(
        { error: '매치를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 2. bi_checkin 레코드 확인 또는 생성
    let checkinRecord = await prisma.bi_checkin.findUnique({
      where: { match_id: matchId }
    });
    
    if (!checkinRecord) {
      // 체크인 레코드가 없으면 새로 생성
      checkinRecord = await prisma.bi_checkin.create({
        data: {
          match_id: matchId,
          player1_checkin: false,
          player2_checkin: false,
          player1_status: 'PENDING',
          player2_status: 'PENDING',
          location_verified: false
        }
      });
    }
    
    // 3. 요청한 사용자가 player1인지 player2인지 확인
    const isPlayer1 = match.player1_id === userId;
    const isPlayer2 = match.player2_id === userId;
    
    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json(
        { error: '이 매치의 참가자가 아닙니다.' },
        { status: 403 }
      );
    }

    // 4. 약속 시간과 현재 시간의 차이 확인 (지각 여부 확인)
    const now = new Date();
    const preferredDate = match.preferred_date!;
    
    // 분 단위 차이 계산 (현재 시간 - 약속 시간)
    const minutesDiff = Math.floor((now.getTime() - preferredDate.getTime()) / (1000 * 60));
    
    let penaltyPoints = 0;
    let penaltyDescription = "";
    let latePenalty = false;
    
    // 지각 여부 및 패널티 포인트 계산
    if (minutesDiff > 0) {
      latePenalty = true;
      
      // 지각 수준에 따른 패널티 적용
      if (minutesDiff <= PENALTY_RULES.LEVEL_1.MAX_MINUTES) {
        penaltyPoints = PENALTY_RULES.LEVEL_1.PENALTY_POINTS;
        penaltyDescription = PENALTY_RULES.LEVEL_1.DESCRIPTION;
      } else if (minutesDiff <= PENALTY_RULES.LEVEL_2.MAX_MINUTES) {
        penaltyPoints = PENALTY_RULES.LEVEL_2.PENALTY_POINTS;
        penaltyDescription = PENALTY_RULES.LEVEL_2.DESCRIPTION;
      } else {
        penaltyPoints = PENALTY_RULES.LEVEL_3.PENALTY_POINTS;
        penaltyDescription = PENALTY_RULES.LEVEL_3.DESCRIPTION;
      }
      
      // 5. 패널티 레코드 생성
      if (latePenalty) {
        await prisma.bi_user_penalty.create({
          data: {
            user_id: userId,
            penalty_type: 'LATE',
            penalty_reason: penaltyDescription, // penalty_reason 필드 사용
            penalty_count: penaltyPoints,      // penalty_count 필드에 점수 저장
            penalty_level: Math.ceil(penaltyPoints / 3), // 필요시 레벨 계산
            expires_at: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90일 후 만료
            is_active: true,
            match_id: matchId,
            created_at: now,
            updated_at: now
          }
        });
        
        // 6. 패널티 누적 점수 확인 및 정지 적용
        const totalPenaltyPoints = await prisma.bi_user_penalty.aggregate({
          where: {
            user_id: userId,
            penalty_type: 'LATE',
            expires_at: { gt: now }, // 만료되지 않은 패널티만 집계
            is_active: true
          },
          _sum: {
            penalty_count: true // penalty_count 필드 사용
          }
        });

        const userTotalPoints = totalPenaltyPoints._sum.penalty_count || 0;

        // 누적 패널티에 따른 정지 적용
        for (const rule of SUSPENSION_RULES) {
          if (userTotalPoints >= rule.POINTS) {
            const suspensionEndDate = new Date(now);
            suspensionEndDate.setDate(suspensionEndDate.getDate() + rule.DAYS);
            
            // 기존 정지 기록 확인
            const existingSuspension = await prisma.bi_user_suspension.findFirst({
              where: {
                user_id: userId,
                suspension_reason: 'LATE_PENALTY',
                end_date: { gt: now }
              }
            });
            
            // 기존 정지 기록이 없거나 새로운 정지 기간이 더 길면 업데이트/생성
            if (!existingSuspension || existingSuspension.end_date < suspensionEndDate) {
              await prisma.bi_user_suspension.upsert({
                where: {
                  suspension_id: existingSuspension?.suspension_id || 0
                },
                update: {
                  end_date: suspensionEndDate,
                  description: rule.DESCRIPTION
                },
                create: {
                  user_id: userId,
                  start_date: now,
                  end_date: suspensionEndDate,
                  suspension_reason: 'LATE_PENALTY',
                  description: rule.DESCRIPTION
                }
              });
            }
            
            break; // 가장 높은 수준의 정지만 적용
          }
        }
      }
    }
    
    // 7. 체크인 정보 업데이트
    const updateData: any = {};
    
    if (isPlayer1) {
      updateData.player1_checkin = true;
      updateData.player1_checkin_time = now;
      updateData.player1_status = latePenalty ? 'LATE' : 'ARRIVED';
    } else {
      updateData.player2_checkin = true;
      updateData.player2_checkin_time = now;
      updateData.player2_status = latePenalty ? 'LATE' : 'ARRIVED';
    }
    
    updateData.updated_at = now;
    
    await prisma.bi_checkin.update({
      where: { match_id: matchId },
      data: updateData
    });
    
    // 8. 양쪽 모두 체크인했는지 확인
    const updatedRecord = await prisma.bi_checkin.findUnique({
      where: { match_id: matchId }
    });
    
    // 9. 양쪽 모두 체크인한 경우 매치 상태 업데이트
    if (updatedRecord?.player1_checkin && updatedRecord?.player2_checkin) {
      await prisma.bi_match.update({
        where: { match_id: matchId },
        data: { match_status: 'IN_PROGRESS' }
      });
    }
    
    // 10. 응답 반환
    return NextResponse.json({
      success: true,
      message: latePenalty 
        ? `체크인이 완료되었습니다. ${penaltyDescription}으로 패널티가 부과되었습니다.` 
        : '체크인이 완료되었습니다.',
      allCheckedIn: updatedRecord?.player1_checkin && updatedRecord?.player2_checkin,
      latePenalty: latePenalty,
      penaltyPoints: penaltyPoints,
      penaltyDescription: penaltyDescription
    });
    
  } catch (error) {
    console.error('체크인 처리 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}