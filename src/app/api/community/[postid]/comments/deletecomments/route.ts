import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { headers } from 'next/headers';

export async function DELETE(
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
      include: { bi_post: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 권한 확인: 자신의 댓글이거나 관리자 또는 게시글 작성자인 경우에만 삭제 가능
    const isAdmin = session.user.bi_level === 'ADMIN';
    const isAuthor = comment.author_id === userId;
    const isPostAuthor = comment.bi_post.author_id === userId;

    if (!isAdmin && !isAuthor && !isPostAuthor) {
      return NextResponse.json(
        { error: '댓글을 삭제할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 헤더에서 IP 주소 및 User-Agent 가져오기
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 트랜잭션으로 댓글 삭제 및 통계 업데이트
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.$transaction(async (tx) => {
      // 댓글 소프트 삭제
      await tx.bi_comment.update({
        where: { id: commentId },
        data: { 
          is_deleted: true,
          updated_at: new Date()
        },
      });

      // 댓글 삭제 로그 생성 (필요시)
      try {
        await tx.$executeRaw`
          INSERT INTO public.bi_comment_log 
          (comment_id, post_id, user_id, ip_address, user_agent, action, created_at, bak_content )
          VALUES 
          (${commentId}, ${comment.post_id}, ${userId}, ${ip}, ${userAgent}, 'delete', NOW(), ${comment.content} )
        `;
      } catch (error) {
        console.log(error)
        // 로그 테이블이 없어도 삭제는 성공으로 처리
        console.log('bi_comment_log 테이블이 없거나 로그 기록 중 오류 발생');
      }

      // 일별 통계 업데이트 (댓글 수 감소)
      await tx.bi_view_stats_daily.upsert({
        where: {
          post_id_view_date: {
            post_id: comment.post_id,
            view_date: today,
          },
        },
        update: {
          comment_count: { decrement: 1 },
        },
        create: {
          post_id: comment.post_id,
          view_date: today,
          view_count: 0,
          unique_users: 0,
          like_count: 0,
          comment_count: 0, // 삭제하는 경우니까 0으로 시작
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: '댓글이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: '댓글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}