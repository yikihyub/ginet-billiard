import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ids = (await params).id

    await prisma.bi_popup.delete({
      where: {
        id: ids,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('팝업 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { error: '팝업 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}