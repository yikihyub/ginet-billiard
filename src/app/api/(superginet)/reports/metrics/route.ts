import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';

// 관리자 권한 체크 함수
// async function isAdmin(userId: string): Promise<boolean> {
//   const user = await prisma.user.findUnique({
//     where: { mb_id: userId },
//     select: { bi_level: true }
//   });
//   return user?.bi_level === 'ADMIN';
// }

// 날짜 형식 함수 (YYYY-MM-DD)
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

type TypeStats = {
  HARASSMENT: number;
  SPAM: number;
  INAPPROPRIATE: number;
  HATE_SPEECH: number;
  THREAT: number;
  PERSONAL_INFO: number;
  OTHER: number;
  [key: string]: number;
};

type MetricsResponse = {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  falseReports: number;
  reportsByType: TypeStats;
  reportsByDate: { date: string; count: number }[];
};

// 신고 통계 조회 API
export async function GET(request: NextRequest) {
  try {
    // 세션 및 관리자 권한 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }
    if (!session || session.user.bi_level !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }


    // URL 쿼리 파라미터 파싱
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'week';
    
    // 날짜 범위 계산
    const startDate = new Date();
    const endDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // 통계 데이터 조회 및 집계

    // 1. 전체 통계
    const totalStats = await prisma.$transaction([
      // 전체 신고 수
      prisma.bi_report.count(),
      // 대기 중인 신고 수
      prisma.bi_report.count({ where: { status: 'PENDING' } }),
      // 해결된 신고 수
      prisma.bi_report.count({ where: { status: 'RESOLVED' } }),
      // 거부된 신고 수 (오신고로 처리된 수)
      prisma.bi_report.count({ where: { status: 'REJECTED' } }),
    ]);

    // 2. 유형별 통계
    const reportsByType = await prisma.bi_report.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
    });

    const typeStats: TypeStats = {
      HARASSMENT: 0,
      SPAM: 0,
      INAPPROPRIATE: 0,
      HATE_SPEECH: 0,
      THREAT: 0,
      PERSONAL_INFO: 0,
      OTHER: 0,
    };

    reportsByType.forEach(item => {
      if (item.type && typeStats.hasOwnProperty(item.type)) {
        typeStats[item.type] = item._count.id;
      } else if (item.type) {
        typeStats.OTHER += item._count.id;
      }
    });

    // 3. 날짜별 통계
    const reportsByDate = await prisma.bi_report.groupBy({
      by: ['created_at'],
      _count: {
        id: true,
      },
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // 날짜별 데이터 포맷팅 (날짜 범위 내 모든 날짜에 대한 데이터 생성)
    const reportsByDateFormatted: { date: string; count: number }[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = formatDate(currentDate);
      const reportData = reportsByDate.find(r => 
        formatDate(r.created_at) === dateStr
      );
      
      reportsByDateFormatted.push({
        date: dateStr,
        count: reportData ? reportData._count.id : 0,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 결과 반환
    const response: MetricsResponse = {
      totalReports: totalStats[0],
      pendingReports: totalStats[1],
      resolvedReports: totalStats[2],
      falseReports: totalStats[3],
      reportsByType: typeStats,
      reportsByDate: reportsByDateFormatted,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching report metrics:', error);
    return NextResponse.json(
      { error: '신고 통계를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}