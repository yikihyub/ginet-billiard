import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, placeId } = body;

  if (!userId || !placeId) {
    return NextResponse.json(
      { message: '사용자 ID와 장소 ID가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 이미 즐겨찾기에 있는지 확인
    const existingFavorite = await prisma.bi_favorites.findFirst({
      where: {
        user_id: userId,
        place_id: parseInt(placeId),
      },
    });

    // 이미 있으면 409 충돌 상태 반환
    if (existingFavorite) {
      return NextResponse.json(
        { message: '이미 즐겨찾기에 추가된 장소입니다.' },
        { status: 409 }
      );
    }

    // 즐겨찾기 추가
    const newFavorite = await prisma.bi_favorites.create({
      data: {
        user_id: userId,
        place_id: parseInt(placeId),
      },
      include: {
        bi_store: true,
      },
    });

    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error('즐겨찾기 추가 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
