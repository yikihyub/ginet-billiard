import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 사용자 상세 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = parseInt((await params).id, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다' },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bi_post: {
          select: {
            id: true,
            title: true,
            created_at: true,
          },
          take: 5,
          orderBy: { created_at: 'desc' }
        },
        bi_comment: {
          select: {
            id: true,
            content: true,
            created_at: true,
          },
          take: 5,
          orderBy: { created_at: 'desc' }
        },

        // bi_match: {
        //   where: {
        //     OR: [
        //       { player1_id: userId },
        //       { player2_id: userId }
        //     ]
        //   },
        //   select: {
        //     id: true,
        //     match_date: true,
        //     winner_id: true,
        //     loser_id: true,
        //   },
        //   take: 5,
        //   orderBy: { match_date: 'desc' }
        // }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('사용자 상세 조회 에러:', error);
    return NextResponse.json(
      { error: '사용자 상세 정보를 조회하는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}