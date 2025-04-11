import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const currentDate = new Date();
    
    // 현재 활성화된 팝업만 가져옴 (시작일과 종료일 사이에 있고, isActive가 true인 팝업)
    const popups = await prisma.bi_popup.findMany({
      where: {
        is_active: true,
        start_date: {
          lte: currentDate,
        },
        end_date: {
          gte: currentDate,
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
    
    return NextResponse.json(popups);
  } catch (error) {
    console.error('팝업을 가져오는 중 오류 발생:', error);
    return NextResponse.json(
      { error: '팝업을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}