import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';
import * as Papa from 'papaparse';

interface UserActivity {
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

    // 날짜 범위 설정
    const startDateTime = startDate 
      ? new Date(`${startDate}T00:00:00.000Z`) 
      : new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const endDateTime = endDate 
      ? new Date(`${endDate}T23:59:59.999Z`) 
      : new Date();

    // 기본 쿼리 조건
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

    // 방문 로그 조회 (최대 10,000개)
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
      take: 10000 // 제한 설정
    });

    // CSV 포맷으로 변환
    const csvData = activities.map((activity: UserActivity) => ({
      '방문 시간': activity.visit_time ? new Date(activity.visit_time).toLocaleString('ko-KR') : '',
      'IP 주소': activity.ip_address || '',
      '사용자 ID': activity.user_id || '',
      '사용자명': activity.bi_user?.name || '',
      '이메일': activity.bi_user?.email || '',
      '디바이스': activity.device_type || '',
      '브라우저': activity.browser || '',
      '운영체제': activity.os || '',
      '방문 페이지': activity.page_url || '',
      '유입 경로': activity.referer_url || '',
      '체류 시간(초)': activity.time_spent || ''
    }));

    const csv = Papa.unparse(csvData);
    
    // CSV 파일 반환
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="user-activity-${ip || 'all'}-${startDate}-${endDate}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting user activity:', error);
    return NextResponse.json(
      { error: 'Failed to export user activity' },
      { status: 500 }
    );
  }
}