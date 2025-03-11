import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, searchTerm, placeId } = body;

  if (!userId || !searchTerm) {
    return NextResponse.json(
      { message: '사용자 ID와 검색어가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 최근 검색 추가
    const newSearch = await prisma.bi_recent_search.create({
      data: {
        user_id: userId,
        search_term: searchTerm,
        place_id: placeId ? parseInt(placeId) : null,
      },
    });

    // 동일 사용자의 최근 검색 개수가 10개를 초과하면 가장 오래된 항목 삭제
    const searchCount = await prisma.bi_recent_search.count({
      where: { user_id: userId },
    });

    if (searchCount > 10) {
      const oldestSearches = await prisma.bi_recent_search.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'asc' },
        take: searchCount - 10,
      });

      if (oldestSearches.length > 0) {
        await prisma.bi_recent_search.deleteMany({
          where: {
            id: { in: oldestSearches.map((s) => s.id) },
          },
        });
      }
    }

    return NextResponse.json(newSearch, { status: 201 });
  } catch (error) {
    console.error('최근 검색 추가 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
