import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // 마지막 경로값 가져오기

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid store ID' }, { status: 400 });
    }

    const store = await prisma.bi_store.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        name: true,
        business_no: true,
        owner_name: true,
        phone: true,
        address: true,
        open_time: true,
        close_time: true,
        comment: true,
        hourly_rate: true,
        facilities: true,
        saturday_open: true,
        saturday_close: true,
        sunday_open: true,
        sunday_close: true,
        weekend_rate: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
