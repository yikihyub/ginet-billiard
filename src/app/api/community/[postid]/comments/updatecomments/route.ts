import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { headers } from 'next/headers';

// 댓글 수정 API
export async function PATCH(
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

    const commentId = parseInt((await params).postid, 10);
    const userId = session.user.mb_id;
    
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: '유효하지 않은 댓글 ID입니다.' },
        { status: 400 }
      );
    }

    // 댓글 정보 조회
    const comment = await prisma.bi_comment.findUnique({
      where: { id: commentId },
      select: { content: true, post_id: true, author_id: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 권한 확인: 자신의 댓글만 수정 가능
    if (comment.author_id !== userId) {
      return NextResponse.json(
        { error: '댓글을 수정할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 요청 본문 파싱
    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: '댓글 내용은 비워둘 수 없습니다.' },
        { status: 400 }
      );
    }

    // 헤더에서 IP 주소 및 User-Agent 가져오기
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 댓글 수정 및 로그 기록
    const updatedComment = await prisma.$transaction(async (tx) => {
      // 댓글 수정
      const updated = await tx.bi_comment.update({
        where: { id: commentId },
        data: {
          content,
          updated_at: new Date(),
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

      // 사용자의 좋아요 여부 확인
      const userLike = await tx.bi_comment_like.findUnique({
        where: {
          comment_id_user_id: {
            comment_id: commentId,
            user_id: userId,
          },
        },
      });

      // 로그 테이블이 있는 경우 로그 기록
      try {
        await tx.$executeRaw`
          INSERT INTO public.bi_comment_log 
          (comment_id, post_id, user_id, ip_address, user_agent, action, created_at, bak_content)
          VALUES 
          (${commentId}, ${comment.post_id}, ${userId}, ${ip}, ${userAgent}, 'update', NOW(), ${comment.content})
        `;
      } catch (error) {
        console.log(error);
        // 로그 테이블이 없어도 댓글 수정은 성공으로 처리
        console.log('bi_comment_log 테이블이 없거나 로그 기록 중 오류 발생');
      }

      return {
        ...updated,
        liked: !!userLike,
      };
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: '댓글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

