import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const placeId = searchParams.get('placeId');

  if (!userId || !placeId) {
    return NextResponse.json(
      { message: '사용자 ID와 장소 ID가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 특정 장소가 즐겨찾기 되었는지 확인
    const favorite = await prisma.bi_favorites.findFirst({
      where: {
        user_id: userId,
        place_id: parseInt(placeId),
      },
    });

    // 즐겨찾기 여부 반환 (있으면 true, 없으면 false)
    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('즐겨찾기 확인 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
