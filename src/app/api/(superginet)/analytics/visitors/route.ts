import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, startOfWeek, startOfMonth, subHours } from 'date-fns';

export async function GET(req: NextRequest ) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') ?? 'today';
  const now = new Date();
  
  let startDate: Date;
  
  // 시간 범위에 따른 시작 날짜 설정
  switch (range) {
    case 'week':
      startDate = startOfWeek(now);
      break;
    case 'month':
      startDate = startOfMonth(now);
      break;
    case 'today':
    default:
      startDate = startOfDay(now);
      break;
  }

  try {
    // 현재 접속자 수 계산 (최근 10분 이내 활동)
    const currentVisitors = await prisma.user_sessions.count({
      where: {
        is_active: true,
        last_activity: {
          gte: subHours(now, 1)
        }
      }
    });

    // 오늘 총 방문자 수
    const visitors = await prisma.visit_logs.findMany({
      where: {
        visit_time: {
          gte: startOfDay(now)
        }
      },
      select: {
        session_id: true
      },
      distinct: ['session_id']
    });

    const totalToday = visitors.length;

    // 시간대별 방문자 데이터 구하기
    const visitorsByTime = await getVisitorsByTime(startDate, range as string);

    // 오늘의 최고 접속자 수 (시간대별 최대값)
    const peakToday = Math.max(...visitorsByTime.map(item => item.count), 0);

    // 디바이스 통계
    const deviceStats = await getDeviceStats(startDate);

    // 인기 페이지
    const popularPages = await getPopularPages(startDate);

    return NextResponse.json({
      currentVisitors,
      totalToday,
      peakToday,
      visitorsByTime,
      deviceStats,
      popularPages,
    });
  } catch (error) {
    console.error('Failed to fetch visitor statistics:', error);
    return NextResponse.json({ message: 'Internal server error' });
  }
}

// 시간대별 방문자 수 계산
async function getVisitorsByTime(startDate: Date, range: string) {
  let groupByFormat: string;
  // let resultFormat: string;
  
  // 범위에 따른 그룹화 형식 설정
  switch (range) {
    case 'week':
      groupByFormat = '%Y-%m-%d';
      // resultFormat = 'yyyy-MM-dd';
      break;
    case 'month':
      groupByFormat = '%Y-%m-%d';
      // resultFormat = 'yyyy-MM-dd';
      break;
    case 'today':
    default:
      groupByFormat = '%Y-%m-%d %H:00:00';
      // resultFormat = 'yyyy-MM-dd HH:00:00';
      break;
  }

  // Prisma 쿼리로 시간대별 방문자 수 집계
  const result = await prisma.$queryRaw`
    SELECT 
      TO_CHAR(visit_time, ${groupByFormat}) AS time_period,
      COUNT(DISTINCT session_id) AS count
    FROM 
      public.visit_logs
    WHERE 
      visit_time >= ${startDate}
    GROUP BY 
      time_period
    ORDER BY 
      time_period
  `;

  // PostgreSQL 결과를 JS 객체로 변환
  return Array.isArray(result) 
    ? result.map((row: any) => ({
        time: row.time_period,
        count: Number(row.count)
      }))
    : [];
}

// 디바이스 유형별 통계
async function getDeviceStats(startDate: Date) {
  const result = await prisma.$queryRaw`
    SELECT 
      device_type,
      COUNT(DISTINCT session_id) AS count
    FROM 
      public.visit_logs
    WHERE 
      visit_time >= ${startDate}
    GROUP BY 
      device_type
    ORDER BY 
      count DESC
  `;

  return Array.isArray(result)
    ? result.map((row: any) => ({
        device: row.device_type || 'unknown',
        count: Number(row.count)
      }))
    : [];
}

// 인기 페이지
async function getPopularPages(startDate: Date) {
  const result = await prisma.$queryRaw`
    SELECT 
      page_url,
      COUNT(DISTINCT session_id) AS visitors,
      COUNT(*) AS pageviews,
      AVG(time_spent) AS avg_time
    FROM 
      public.visit_logs
    WHERE 
      visit_time >= ${startDate}
      AND page_url IS NOT NULL
    GROUP BY 
      page_url
    ORDER BY 
      visitors DESC
    LIMIT 10
  `;

  return Array.isArray(result)
    ? result.map((row: any) => ({
        url: row.page_url,
        visitors: Number(row.visitors),
        pageviews: Number(row.pageviews),
        avgTime: Math.round(Number(row.avg_time) || 0)
      }))
    : [];
}