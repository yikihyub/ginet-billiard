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
    const favorites = await prisma.bi_favorites.findMany({
      where: {
        user_id: userId,
      },
      include: {
        bi_store: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(favorites.map((fav) => fav.bi_store));
  } catch (error) {
    console.error('즐겨찾기 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
