import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const store_name = url.pathname.split('/').pop() ?? '';

  try {
    const store = await prisma.bi_store.findMany({
      where: {
        name: {
          contains: decodeURIComponent(store_name), // 부분 검색 (LIKE '%두꺼비 당구%')
          mode: 'insensitive', // 대소문자 구분 없음
        },
      },
      select: {
        id: true,
        name: true,
        owner_name: true,
        address: true,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
