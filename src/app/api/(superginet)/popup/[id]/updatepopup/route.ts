import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const ids = (await params).id

    const popup = await prisma.bi_popup.update({
      where: {
        id: ids,
      },
      data: {
        title: data.title,
        content: data.content,
        image_url: data.imageUrl || null,
        link_url: data.linkUrl || null,
        start_date: new Date(data.startDate),
        end_date: new Date(data.endDate),
        is_active: data.isActive,
        width: data.width,
        height: data.height,
        position: data.position,
        show_once: data.showOnce,
        display_on: data.displayOn,
        order: data.order,
      },
    });
    
    return NextResponse.json(popup);
  } catch (error) {
    console.error('팝업 수정 중 오류 발생:', error);
    return NextResponse.json(
      { error: '팝업 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}