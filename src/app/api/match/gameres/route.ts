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
    
    // 2. 사용자가 player2_id인 게임 매치 데이터 조회
    const matches = await prisma.bi_match.findMany({
      where: {
        player2_id: user.mb_id
      },
      select: {
        match_id: true,
        request_status: true
      }
    });
    
    // 3. 승낙 및 거절 수 집계
    const acceptCount = matches.filter(match => match.request_status === 'ACCEPTED').length;
    const rejectCount = matches.filter(match => match.request_status === 'REJECTED').length;
    const totalCount = matches.length;
    
    return NextResponse.json({
      user: {
        mb_id: user.mb_id,
        name: user.name
      },
      responseStats: {
        accept: acceptCount,
        reject: rejectCount,
        total: totalCount,
        acceptRate: totalCount > 0 ? (acceptCount / totalCount) * 100 : 0
      },
      matchCount: totalCount
    });
    
  } catch (error) {
    console.error('게임 응답 데이터 조회 오류:', error);
    return NextResponse.json(
      { error: '게임 응답 데이터 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}