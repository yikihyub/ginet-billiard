import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 모든 팝업 가져오기
export async function GET() {
  try {
    const popups = await prisma.bi_popup.findMany({
      orderBy: [
        { is_active: 'desc' },
        { order: 'asc' },
        { updated_at: 'desc' },
      ],
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