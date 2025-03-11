import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { message: '사용자 ID가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const recentSearches = await prisma.bi_recent_search.findMany({
      where: {
        user_id: userId,
      },
      include: {
        bi_store: true, // bi_store 정보 포함
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10, // 최근 10개만 가져오기
    });

    return NextResponse.json(recentSearches);
  } catch (error) {
    console.error('최근 검색 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
