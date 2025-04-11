import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 특정 팝업 가져오기
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
    const ids = (await params).id;

    const popup = await prisma.bi_popup.findUnique({
      where: {
        id: ids,
      },
    });
    
    if (!popup) {
      return NextResponse.json(
        { error: '팝업을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(popup);
  } catch (error) {
    console.error('팝업을 가져오는 중 오류 발생:', error);
    return NextResponse.json(
      { error: '팝업을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
