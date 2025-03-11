import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const searchId = searchParams.get('id');

  if (!userId || !searchId) {
    return NextResponse.json(
      { message: '사용자 ID와 검색 ID가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 사용자의 검색 데이터인지 확인
    const search = await prisma.bi_recent_search.findFirst({
      where: {
        id: parseInt(searchId),
        user_id: userId,
      },
    });

    if (!search) {
      return NextResponse.json(
        { message: '검색 데이터를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 최근 검색 삭제
    await prisma.bi_recent_search.delete({
      where: {
        id: parseInt(searchId),
      },
    });

    return NextResponse.json({ message: '최근 검색이 삭제되었습니다.' });
  } catch (error) {
    console.error('최근 검색 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
