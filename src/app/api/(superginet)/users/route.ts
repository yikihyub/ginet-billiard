import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
    // URL 쿼리 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const level = searchParams.get('level') || 'all';
    const status = searchParams.get('status') || 'all';
    const game = searchParams.get('game') || 'all';
    const warningCount = searchParams.get('warningCount') || 'all';
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';
    const includeStats = searchParams.get('stats') === 'true';

    // 기본 필터 조건
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    
    // 검색어 필터
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phonenum: { contains: search } }
      ];
    }
    
    // 회원 레벨 필터
    if (level && level !== 'all') {
      where.bi_level = level;
    }
    
    // 차단 상태 필터
    if (status === 'banned') {
      where.is_banned = true;
    } else if (status === 'active') {
      where.is_banned = false;
    }
    
    // 선호 게임 필터
    if (game && game !== 'all') {
      where.preferGame = game;
    }
    
    // 경고 수 필터
    if (warningCount === 'warning') {
      where.warning_count = { gt: 0 };
    } else if (warningCount === 'noWarning') {
      where.warning_count = 0;
    }
    
    // 총 사용자 수 조회
    const totalUsers = await prisma.user.count({ where });
    
    // 정렬 옵션
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {};
    orderBy[sortField] = sortDirection;
    
    // 사용자 조회
    const users = await prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phonenum: true,
        preferGame: true,
        loginAt: true,
        logoutAt: true,
        createdAt: true,
        profile_image: true,
        provider: true,
        is_banned: true,
        ban_reason: true,
        ban_expires_at: true,
        warning_count: true,
        trust_score: true,
        bi_level: true,
        user_three_ability: true,
        user_four_ability: true,
      }
    });
    
    // 결과 객체
    const result = {
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit)
      }
    };
    
    // 통계 정보 요청이 있는 경우
    if (includeStats) {
      // 이번 달 신규 회원 수
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const newUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      });
      
      // 차단된 회원 수
      const bannedUsers = await prisma.user.count({
        where: {
          is_banned: true
        }
      });
      
      // 신고된 회원 수
      const reportedUsersQuery = await prisma.bi_report.findMany({
        select: {
          reported_user_id: true
        },
        distinct: ['reported_user_id']
      });
      
      const reportedUsers = reportedUsersQuery.length;
      
      // 통계 정보 추가
      Object.assign(result, {
        stats: {
          totalUsers,
          newUsers,
          bannedUsers,
          reportedUsers
        }
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('사용자 조회 에러:', error);
    return NextResponse.json(
      { error: '사용자를 조회하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}