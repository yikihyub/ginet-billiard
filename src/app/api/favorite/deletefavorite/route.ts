import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
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
    // 즐겨찾기 찾기
    const favorite = await prisma.bi_favorites.findFirst({
      where: {
        user_id: userId,
        place_id: parseInt(placeId),
      },
    });

    // 존재하지 않으면 404 반환
    if (!favorite) {
      return NextResponse.json(
        { message: '즐겨찾기를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 즐겨찾기 삭제
    await prisma.bi_favorites.delete({
      where: {
        id: favorite.id,
      },
    });

    return NextResponse.json({ message: '즐겨찾기가 삭제되었습니다.' });
  } catch (error) {
    console.error('즐겨찾기 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
