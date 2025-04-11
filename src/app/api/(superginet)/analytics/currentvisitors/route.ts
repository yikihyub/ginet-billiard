import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subMinutes } from 'date-fns';

export async function GET() {
  try {
    // 최근 5분 이내 활동이 있는 세션 수 계산
    const activeTime = subMinutes(new Date(), 5);
    
    const count = await prisma.user_sessions.count({
      where: {
        is_active: true,
        last_activity: {
          gte: activeTime
        }
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to fetch current visitors:', error);
    return NextResponse.json({ message: 'Internal server error', status:500 });
  }
}