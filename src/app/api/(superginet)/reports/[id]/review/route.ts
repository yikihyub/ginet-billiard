import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';
import { v4 as uuid } from 'uuid';

import { action_type } from '@prisma/client';


// 관리자 권한 체크 함수
async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { mb_id: userId },
    select: { bi_level: true }
  });
  return user?.bi_level === 'ADMIN';
}

interface ReviewBody {
  decision: string;
  comment?: string;
}

// 신고 처리(리뷰) API
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 신고 ID 추출
    const reportId = (await params).id;
    
    // 세션 및 관리자 권한 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const moderatorId = session.user.id;
    const isUserAdmin = await isAdmin(moderatorId);
    if (!isUserAdmin) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    // 요청 본문 파싱
    const body = await request.json() as ReviewBody;
    const { decision, comment } = body;
    
    // 필수 필드 검증
    if (!decision) {
      return NextResponse.json({ error: '조치 유형은 필수입니다.' }, { status: 400 });
    }

    // 유효한 조치 유형인지 검증
    const validActions = ['WARNING', 'CONTENT_REMOVAL', 'TEMPORARY_BAN', 'PERMANENT_BAN', 'NO_ACTION'];
    if (!validActions.includes(decision)) {
      return NextResponse.json({ error: '유효하지 않은 조치 유형입니다.' }, { status: 400 });
    }

    // 리포트가 존재하는지 확인
    const report = await prisma.bi_report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: '해당 신고를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 이미 처리된 신고인지 확인
    if (report.status !== 'PENDING') {
      return NextResponse.json({ error: '이미 처리된 신고입니다.' }, { status: 400 });
    }

    // 트랜잭션으로 신고 처리 및 리뷰 생성
    const result = await prisma.$transaction(async (tx) => {
      // 1. 신고 상태 업데이트
      const updatedReport = await tx.bi_report.update({
        where: { id: reportId },
        data: {
          status: decision === 'NO_ACTION' ? 'REJECTED' : 'RESOLVED',
action_taken: decision === 'NO_ACTION' ? null : decision as action_type,
          updated_at: new Date(),
        },
      });

      // 2. 신고 리뷰 생성
      const reviewId = uuid();
      const createdReview = await tx.bi_report_review.create({
        data: {
          id: reviewId,
          moderator_id: moderatorId,
          report_id: reportId,
          decision: decision as action_type,
          comment: comment || null,
          created_at: new Date(),
        },
      });

      // 3. 신고 유형에 따른 통계 업데이트
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const metrics = await tx.bi_report_metrics.findUnique({
        where: { date: today },
      });

      if (metrics) {
        // 기존 레코드 업데이트
        await tx.bi_report_metrics.update({
          where: { id: metrics.id },
          data: {
            resolved_reports: decision !== 'NO_ACTION' ? metrics.resolved_reports + 1 : metrics.resolved_reports,
            pending_reports: metrics.pending_reports - 1,
            false_reports: decision === 'NO_ACTION' ? metrics.false_reports + 1 : metrics.false_reports,
          },
        });
      } else {
        // 새 레코드 생성
        // const metricsId = uuid();
        // const reportTypeField = getReportTypeField(report.type);
        
        // const initialData: any = {
        //   id: metricsId,
        //   date: today,
        //   total_reports: 1,
        //   resolved_reports: decision !== 'NO_ACTION' ? 1 : 0,
        //   pending_reports: 0,
        //   false_reports: decision === 'NO_ACTION' ? 1 : 0,
        // };
        
        // if (reportTypeField) {
        //   initialData[reportTypeField] = 1;
        // }
        
        // await tx.bi_report_metrics.create({
        //   data: initialData
        // });

        // 새 레코드 생성
        const metricsId = uuid();
        const reportTypeField = getReportTypeField(report.type);
        
        interface BiReportMetricsData {
          id: string;
          date: Date;
          total_reports: number;
          resolved_reports: number;
          pending_reports: number;
          false_reports: number;
          [key: string]: string | number | Date; // For dynamic fields
        }
        
        const initialData: BiReportMetricsData = {
          id: metricsId,
          date: today,
          total_reports: 1,
          resolved_reports: decision !== 'NO_ACTION' ? 1 : 0,
          pending_reports: 0,
          false_reports: decision === 'NO_ACTION' ? 1 : 0,
        };
        
        if (reportTypeField) {
          initialData[reportTypeField] = 1;
        }
        
        await tx.bi_report_metrics.create({
          data: initialData
        });
      }

      return { updatedReport, createdReview };
    });

    return NextResponse.json({
      message: '신고가 성공적으로 처리되었습니다.',
      report: result.updatedReport,
      review: result.createdReview,
    });
  } catch (error) {
    console.error('Error processing report review:', error);
    return NextResponse.json(
      { error: '신고 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 신고 유형에 따른 통계 필드명 반환
function getReportTypeField(type: string | null): string | null {
  if (!type) return null;
  
  const typeMap: Record<string, string> = {
    'HARASSMENT': 'harassment_reports',
    'SPAM': 'spam_reports',
    'INAPPROPRIATE': 'inappropriate_reports',
    'HATE_SPEECH': 'hate_speech_reports',
    'THREAT': 'threat_reports',
    'PERSONAL_INFO': 'personal_info_reports',
    'OTHER': 'other_reports',
  };
  
return typeMap[type] || 'other_reports';
}