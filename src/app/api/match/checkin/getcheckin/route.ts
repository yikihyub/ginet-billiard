import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const match_id = searchParams.get('matchId');
    const matchId = Number(match_id);

    if (!matchId) {
      return NextResponse.json(
        { error: '매치 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 매치 참가자들의 체크인 상태 조회
    const participants = await prisma.bi_match_participant.findMany({
      where: { match_id: matchId },
      select: {
        user_id: true,
        checked_in: true,
        checked_in_at: true,
        bi_user: {
          select: {
            name: true,
          }
        }
      }
    });
    
    // 참가자가 2명이 아니면 오류
    if (participants.length !== 2) {
      return NextResponse.json(
        { error: '매치 참가자 정보가 올바르지 않습니다.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      matchId,
      participants: participants.map(p => ({
        userId: p.user_id,
        name: p.bi_user?.name,
        checkedIn: p.checked_in,
        checkedInAt: p.checked_in_at
      })),
      allCheckedIn: participants.every(p => p.checked_in)
    });
  } catch (error) {
    console.error('체크인 상태 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
