import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postid: string }> }
) {
  try {
    // 로그인 확인
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요한 기능입니다.' },
        { status: 401 }
      );
    }

    const postId = parseInt((await params).postid, 10);
    const userId = parseInt(session.user.id as string, 10);
    
    if (isNaN(postId) || isNaN(userId)) {
      return NextResponse.json(
        { error: '잘못된 요청입니다.' },
        { status: 400 }
      );
    }

    // 게시글 존재 확인
    const post = await prisma.bi_post.findUnique({
      where: { id: postId, is_deleted: false },
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 오늘 날짜 (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 좋아요 여부 확인
    const existingLike = await prisma.bi_post_like.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });

    let liked = false;

    await prisma.$transaction(async (tx) => {
      if (existingLike) {
        // 좋아요 취소
        await tx.bi_post_like.delete({
          where: {
            post_id_user_id: {
              post_id: postId,
              user_id: userId,
            },
          },
        });
        liked = false;
      } else {
        // 좋아요 생성
        await tx.bi_post_like.create({
          data: {
            post_id: postId,
            user_id: userId,
          },
        });
        liked = true;
      }

      // 일별 통계 업데이트 (좋아요 관련 필드 추가)
      await tx.bi_view_stats_daily.upsert({
        where: {
          post_id_view_date: {
            post_id: postId,
            view_date: today,
          },
        },
        update: {
          // 좋아요가 추가되면 증가, 취소되면 감소
          like_count: liked ? { increment: 1 } : { decrement: 1 },
        },
        create: {
          post_id: postId,
          view_date: today,
          view_count: 0,
          unique_users: 0,
          like_count: liked ? 1 : 0,
        },
      });
    });

    // 현재 좋아요 수 계산
    const likeCount = await prisma.bi_post_like.count({
      where: { post_id: postId },
    });

    return NextResponse.json({
      liked,
      likeCount,
      message: liked ? '게시글을 좋아합니다.' : '좋아요가 취소되었습니다.',
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: '좋아요 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}