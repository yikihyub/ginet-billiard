import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { headers } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postid: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요한 기능입니다.' },
        { status: 401 }
      );
    }

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

    // 요청 본문 파싱
    const { content, parentId } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: '댓글 내용은 비워둘 수 없습니다.' },
        { status: 400 }
      );
    }

    // 사용자 ID 확인
    const userId = session.user.mb_id;

    // 부모 댓글 ID가 있는 경우, 해당 댓글이 존재하는지 확인
    if (parentId) {
      const parentComment = await prisma.bi_comment.findUnique({
        where: { id: parentId, is_deleted: false },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: '답글을 달 댓글을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
    }

    // 헤더에서 IP 주소 및 User-Agent 가져오기
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 트랜잭션으로 댓글 저장 및 통계 업데이트
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const comment = await prisma.$transaction(async (tx) => {
      // 댓글 생성
      const newComment = await tx.bi_comment.create({
        data: {
          content,
          post_id: postId,
          author_id: userId || '',
          parent_id: parentId || null,
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
      });

      try {
        await tx.bi_comment_log.create({
          data: {
            comment_id: newComment.id,
            post_id: postId,
            user_id: userId || '',
            ip_address: ip ?? 'unkown',
            user_agent: userAgent ?? 'unknown',
            action: "create",
            created_at: new Date(),
          },
        });

        console.log("✅ 로그 저장 완료");
      } catch (error) {
        console.error("❌ 로그 저장 실패:", error);
      }

      // 일별 통계 업데이트
      prisma.bi_view_stats_daily.upsert({
        where: {
          post_id_view_date: {
            post_id: postId,
            view_date: today,
          },
        },
        update: {
          comment_count: { increment: 1 },
        },
        create: {
          post_id: postId,
          view_date: today,
          view_count: 0,
          unique_users: 0,
          like_count: 0,
          comment_count: 1,
        },
      });

        return newComment;
    });
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: '댓글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}