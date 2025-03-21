import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postid: string }> }
) {
  try {
    const postId = parseInt((await params).postid, 10);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '유효하지 않은 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    // 게시글 확인
    const post = await prisma.bi_post.findUnique({
      where: { id: postId, is_deleted: false },
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 댓글 및 답글 목록 조회
    const comments = await prisma.bi_comment.findMany({
      where: {
        post_id: postId,
        is_deleted: false,
        parent_id: null, // 최상위 댓글만 조회
      },
      include: {
        bi_user: {
          select: {
            id: true,
            name: true,
            profile_image: true,
          },
        },
        // 답글도 포함하여 조회
        other_bi_comment: {
          where: {
            is_deleted: false,
          },
          orderBy: {
            created_at: 'asc',
          },
          include: {
            bi_user: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
            _count: {
              select: {
                bi_comment_like: true,
              },
            },
          },
        },
        _count: {
          select: {
            bi_comment_like: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc', // 최신 댓글 순
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: '댓글 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
