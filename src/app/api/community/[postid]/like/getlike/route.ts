import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function GET(
    request: NextRequest,
  { params }: { params: Promise<{ postid: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const postId = parseInt((await params).postid, 10);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '잘못된 요청입니다.' },
        { status: 400 }
      );
    }

    // 좋아요 수 계산
    const likeCount = await prisma.bi_post_like.count({
      where: { post_id: postId },
    });

    // 사용자가 로그인한 경우 좋아요 여부 확인
    let liked = false;
    if (session?.user) {
      const userId = parseInt(session.user.id as string, 10);
      const existingLike = await prisma.bi_post_like.findUnique({
        where: {
          post_id_user_id: {
            post_id: postId,
            user_id: userId,
          },
        },
      });
      liked = !!existingLike;
    }

    return NextResponse.json({
      liked,
      likeCount,
    });
  } catch (error) {
    console.error('Error getting like status:', error);
    return NextResponse.json(
      { error: '좋아요 상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}