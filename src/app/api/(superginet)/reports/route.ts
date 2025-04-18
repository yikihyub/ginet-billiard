//원본
// import { NextResponse, NextRequest } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/config/authOptions';

// // 관리자 권한 체크 함수
// // async function isAdmin(userId: string): Promise<boolean> {
// //   const user = await prisma.user.findUnique({
// //     where: { mb_id: userId },
// //     select: { bi_level: true }
// //   });
// //   return user?.bi_level === 'ADMIN';
// // }

// // 신고 목록 조회 API
// export async function GET(request: NextRequest) {

//   try {
//     // 세션 및 관리자 권한 확인
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
//     }
//     if (!session || session.user.bi_level !== 'ADMIN') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     // URL 쿼리 파라미터 파싱
//     const searchParams = request.nextUrl.searchParams;
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const status = searchParams.get('status');
//     const type = searchParams.get('type');
//     const search = searchParams.get('search') || '';
//     const dateFrom = searchParams.get('dateFrom');
//     const dateTo = searchParams.get('dateTo');

//     // 필터 조건 생성
//     const whereClause: any = {};
    
//     // 상태 필터
//     if (status && status !== 'ALL') {
//       whereClause.status = status;
//     }
    
//     // 유형 필터
//     if (type && type !== 'ALL') {
//       whereClause.type = type;
//     }
    
//     // 날짜 필터
//     if (dateFrom || dateTo) {
//       whereClause.created_at = {};
//       if (dateFrom) {
//         whereClause.created_at.gte = new Date(dateFrom);
//       }
//       if (dateTo) {
//         // 종료일은 해당 날짜의 끝까지 포함
//         const endDate = new Date(dateTo);
//         endDate.setHours(23, 59, 59, 999);
//         whereClause.created_at.lte = endDate;
//       }
//     }
    
//     // 검색어 필터 (신고자, 신고 대상자, 설명)
//     if (search) {
//       whereClause.OR = [
//         { reporter_id: { contains: search, mode: 'insensitive' } },
//         { reported_user_id: { contains: search, mode: 'insensitive' } },
//         { description: { contains: search, mode: 'insensitive' } },
//       ];
//     }

//     // 전체 신고 수 조회
//     const totalCount = await prisma.bi_report.count({
//       where: whereClause,
//     });

//     // 페이징된 신고 목록 조회
//     const reports = await prisma.bi_report.findMany({
//       where: whereClause,
//       orderBy: {
//         created_at: 'desc',
//       },
//       skip: (page - 1) * limit,
//       take: limit,
//       include: {
//         bi_user_bi_report_reporter_idTobi_user: {
//           select: {
//             mb_id: true,
//             name: true,
//           },
//         },
//         bi_user_bi_report_reported_user_idTobi_user: {
//           select: {
//             mb_id: true,
//             name: true,
//           },
//         },
//       },
//     });

//     // 응답 형식 변환 (클라이언트에 필요한 형태로)
//     const formattedReports = reports.map(report => ({
//       id: report.id,
//       created_at: report.created_at,
//       updated_at: report.updated_at,
//       reporter_id: report.reporter_id,
//       reporter_name: report.bi_user_bi_report_reporter_idTobi_user.name,
//       reported_user_id: report.reported_user_id,
//       reported_user_name: report.bi_user_bi_report_reported_user_idTobi_user.name,
//       content_id: report.content_id,
//       content_type: report.content_type,
//       type: report.type,
//       description: report.description,
//       status: report.status,
//       ip_address: report.ip_address,
//       action_taken: report.action_taken,
//     }));

//     return NextResponse.json({
//       reports: formattedReports,
//       currentPage: page,
//       totalPages: Math.ceil(totalCount / limit),
//       totalItems: totalCount,
//     });
//   } catch (error) {
//     console.error('Error fetching reports:', error);
//     return NextResponse.json(
//       { error: '신고 목록을 불러오는 중 오류가 발생했습니다.' },
//       { status: 500 }
//     );
//   }
// }

// 타입수정
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }
    if (session.user.bi_level !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // whereClause 타입 명시적으로 지정
    const whereClause: {
      report_status?: string;
      report_type?: string;
      OR?: {
        content?: { contains: string };
        target_user_id?: { contains: string };
        reporter_id?: { contains: string };
      }[];
      created_at?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (status) {
      whereClause.report_status = status;
    }

    if (type) {
      whereClause.report_type = type;
    }

    if (search) {
      whereClause.OR = [
        { content: { contains: search } },
        { target_user_id: { contains: search } },
        { reporter_id: { contains: search } },
      ];
    }

    if (dateFrom && dateTo) {
      whereClause.created_at = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const reports = await prisma.bi_report.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    const totalCount = await prisma.bi_report.count({ where: whereClause });

    return NextResponse.json({
      data: reports,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('[REPORT_GET]', error);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
