import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';

interface UserActivity {
  id: number;
  username: string | null;
  visit_time?: Date | null;
  ip_address?: string | null;
  user_id?: number | null;
  device_type?: string | null;
  browser?: string | null;
  os?: string | null;
  page_url?: string | null;
  referer_url?: string | null;
  time_spent?: number | null;
  bi_user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

interface VisitLogsWhereInput {
  visit_time?: {
    not?: null;
    gte?: Date;
    lte?: Date;
  };
  ip_address?: {
    contains: string;
  };
  device_type?: string;
}

export async function GET(request: NextRequest) {
  try {
    // 권한 확인 (어드민만 접근 가능)
    const session = await getServerSession(authOptions);
    if (!session || session.user.bi_level !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // URL 파라미터 가져오기
    const searchParams = request.nextUrl.searchParams;
    const ip = searchParams.get('ip') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const filter = searchParams.get('filter') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;

    // 날짜 범위 설정
    const startDateTime = startDate 
      ? new Date(`${startDate}T00:00:00.000Z`) 
      : new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const endDateTime = endDate 
      ? new Date(`${endDate}T23:59:59.999Z`) 
      : new Date();

    // 기본 쿼리 조건
    // const where: any = {
    //   AND: [
    //     { visit_time: { gte: startDateTime } },
    //     { visit_time: { lte: endDateTime } }
    //   ]
    // };

    const where: VisitLogsWhereInput = {
      visit_time: {
        not: null,
        gte: startDateTime,
        lte: endDateTime,
      },
    };

    // IP 주소 필터링
    if (ip) {
      where.ip_address = { contains: ip };
    }

    // 디바이스 타입 필터링
    if (filter !== 'all') {
      where.device_type = filter;
    }

    // 전체 카운트 쿼리
    const total = await prisma.visit_logs.count({ where });

    // 방문 로그 조회
    const activities = await prisma.visit_logs.findMany({
      where,
      include: {
        bi_user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        visit_time: 'desc'
      },
      skip: offset,
      take: limit
    });

    // 결과 포맷팅
    const formattedActivities = activities.map((activity): UserActivity => ({
      id: activity.id,
      ip_address: activity.ip_address || '',
      user_id: activity.user_id,
      username: activity.bi_user?.name || null,
      visit_time: activity.visit_time,
      page_url: activity.page_url,
      referer_url: activity.referer_url,
      browser: activity.browser,
      os: activity.os,
      device_type: activity.device_type,
      time_spent: activity.time_spent
    }));

    return NextResponse.json({
      activities: formattedActivities,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user activity' },
      { status: 500 }
    );
  }
}