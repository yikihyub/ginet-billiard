import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest,) {
  const body = await req.json();
  const { exitTime, url } = body;

  const session = (await cookies()).get('session_id')?.value;

  if (!session) {
    return NextResponse.json({ message: 'No session found' });
  }
  
  try {
    // 해당 세션의 마지막 방문 로그 찾기
    const lastVisit = await prisma.visit_logs.findFirst({
      where: { 
        session_id: session,
        page_url: url
      },
      orderBy: { visit_time: 'desc' }
    });
    
    if (lastVisit && !lastVisit.exit_time) {
      // 방문 시간과 종료 시간 사이의 차이 계산 (초 단위)
      const visitTime = new Date(lastVisit.visit_time!).getTime();
      const exitTimeMs = new Date(exitTime).getTime();
      const timeSpent = Math.floor((exitTimeMs - visitTime) / 1000);
      
      // 종료 시간 및 체류 시간 업데이트
      await prisma.visit_logs.update({
        where: { id: lastVisit.id },
        data: {
          exit_time: new Date(exitTime),
          time_spent: timeSpent > 0 ? timeSpent : 0
        }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log exit time:', error);
    return NextResponse.json({ message: 'Internal server error' });
  }
}