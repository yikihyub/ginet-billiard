import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// 하루에 사용자당 최대 신고 개수
const MAX_REPORTS_PER_DAY = 5;
const MAX_REPORTS_PER_IP_PER_DAY = 10;

export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요한 기능입니다.' },
        { status: 401 }
      );
    }

    const reporterId = session.user.mb_id;
    
    // 2. 헤더에서 IP 주소 가져오기
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown';
    
    // 3. 요청 데이터 파싱
    const { 
      reportedUserId, 
      contentId, 
      contentType, 
      type, 
      description 
    } = await request.json();

    // 필수 필드 검증
    if (!reportedUserId || !type) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 자기 자신 신고 방지
    if (reporterId === reportedUserId) {
      return NextResponse.json(
        { error: '자기 자신을 신고할 수 없습니다.' },
        { status: 400 }
      );
    }
    
    // 4. 신고 제한 확인
    // 사용자 제한 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const userReportsToday = await prisma.bi_report.count({
      where: {
        reporter_id: reporterId || '',
        created_at: {
          gte: today
        }
      }
    });
    
    if (userReportsToday >= MAX_REPORTS_PER_DAY) {
      return NextResponse.json(
        { error: '일일 신고 한도를 초과했습니다. 내일 다시 시도해주세요.' },
        { status: 429 }
      );
    }
    
    // IP 제한 확인
    const ipReportsToday = await prisma.bi_report.count({
      where: {
        ip_address: ipAddress,
        created_at: {
          gte: today
        }
      }
    });

    if (ipReportsToday >= MAX_REPORTS_PER_IP_PER_DAY) {
      return NextResponse.json(
        { error: '이 IP 주소에서 일일 신고 한도를 초과했습니다.' },
        { status: 429 }
      );
    }
    
    // 5. 동일 콘텐츠에 대한 이전 신고 확인
    if (contentId && contentType) {
      const existingReport = await prisma.bi_report.findFirst({
        where: {
          reporter_id: reporterId || '',
          content_id: contentId,
          content_type: contentType,
          created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7일 이내
          }
        }
      });
      
        console.log('5. 동일 콘텐츠에 대한 이전 신고 확인:', existingReport)

      if (existingReport) {
        return NextResponse.json(
          { error: '이미 이 콘텐츠를 최근에 신고하셨습니다.' },
          { status: 409 }
        );
      }
    }


    
    // 6. 신고 생성
    const report = await prisma.bi_report.create({
      data: {
        id: uuidv4(),
        reporter_id: reporterId || '',
        reported_user_id: reportedUserId,
        content_id: contentId,
        content_type: contentType,
        type,
        description,
        status: 'PENDING',
        ip_address: ipAddress
      }
    });

    // 7. 신고 제한 카운터 업데이트
    await prisma.bi_report_limit.upsert({
      where: { user_id: reporterId || '' },
      update: {
        report_count: { increment: 1 },
        last_report_at: new Date()
      },
      create: {
        id: uuidv4(),
        user_id: reporterId,
        report_count: 1,
        last_report_at: new Date()
      }
    });

    // IP 기반 제한도 업데이트
    await prisma.bi_report_limit.upsert({
      where: { ip_address: ipAddress },
      update: {
        report_count: { increment: 1 },
        last_report_at: new Date()
      },
      create: {
        id: uuidv4(),
        ip_address: ipAddress,
        report_count: 1,
        last_report_at: new Date()
      }
    });
    
    // 8. 신고 메트릭 업데이트
    const today2 = new Date();
    today2.setHours(0, 0, 0, 0);
    
    await prisma.bi_report_metrics.upsert({
      where: { date: today2 },
      update: {
        total_reports: { increment: 1 },
        pending_reports: { increment: 1 },
        [getReportTypeMetricField(type)]: { increment: 1 }
      },
      create: {
        id: uuidv4(),
        date: today2,
        total_reports: 1,
        pending_reports: 1,
        resolved_reports: 0,
        false_reports: 0,
        harassment_reports: type === 'HARASSMENT' ? 1 : 0,
        spam_reports: type === 'SPAM' ? 1 : 0,
        inappropriate_reports: type === 'INAPPROPRIATE_CONTENT' ? 1 : 0,
        hate_speech_reports: type === 'HATE_SPEECH' ? 1 : 0,
        threat_reports: type === 'THREAT' ? 1 : 0,
        personal_info_reports: type === 'PERSONAL_INFO' ? 1 : 0,
        other_reports: type === 'OTHER' ? 1 : 0
      }
    });
    
    // 9. 응답
    return NextResponse.json({
      success: true,
      message: '신고가 접수되었습니다.',
      reportId: report.id
    });
    
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: '신고 접수 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// 신고 유형에 해당하는 메트릭 필드명 반환
function getReportTypeMetricField(type: string): string {
  switch (type) {
    case 'HARASSMENT': return 'harassment_reports';
    case 'SPAM': return 'spam_reports';
    case 'INAPPROPRIATE_CONTENT': return 'inappropriate_reports';
    case 'HATE_SPEECH': return 'hate_speech_reports';
    case 'THREAT': return 'threat_reports';
    case 'PERSONAL_INFO': return 'personal_info_reports';
    case 'OTHER': return 'other_reports';
    default: return 'other_reports';
  }
}