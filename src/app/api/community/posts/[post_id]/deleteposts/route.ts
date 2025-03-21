import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { headers } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ post_id: string }> }
) {
  try {
    // 1. 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요한 기능입니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.mb_id;
    const postId = parseInt((await params).post_id, 10);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '유효하지 않은 게시글 ID입니다.' },
        { status: 400 }
      );
    }

    // 2. 게시글이 존재하는지 확인하고, 권한 검증
    const existingPost = await prisma.bi_post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 작성자 또는 관리자만 삭제 가능
    const isAdmin = session.user.bi_level === 'ADMIN';
    if (existingPost.author_id !== userId && !isAdmin) {
      return NextResponse.json(
        { error: '게시글을 삭제할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 헤더에서 IP 주소 및 User-Agent 가져오기
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 3. 트랜잭션으로 로그 기록 및 게시글 삭제 처리
    await prisma.$transaction(async (tx) => {
      // 게시글 정보를 로그에 저장
      await tx.bi_post_log.create({
        data: {
          post_id: postId,
          author_id: existingPost.author_id || '',
          title: existingPost.title,
          content: existingPost.content,
          category_id: existingPost.category_id,
          action: 'delete',
          user_id: userId || '',
          ip_address: ip,
          user_agent: userAgent,
          original_created_at: existingPost.created_at,
          original_updated_at: existingPost.updated_at
        }
      });

      // 게시글의 모든 댓글 가져오기 (부모 댓글과 답글 모두)
      const allComments = await tx.bi_comment.findMany({
        where: {
          post_id: postId,
          is_deleted: false,
        },
        include: {
          bi_user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // 댓글이 있는 경우 각 댓글을 로그에 기록
      if (allComments.length > 0) {
        for (const comment of allComments) {
          try {
            await tx.bi_comment_log.create({
              data: {
                comment_id: comment.id,
                post_id: postId,
                user_id: userId || '',
                ip_address: ip,
                user_agent: userAgent,
                action: 'post_deleted',
                created_at: new Date(),
                bak_content: comment.content
                // 추가 정보를 저장하기 위한 메타데이터 필드가 있다면 활용
                // metadata: JSON.stringify({
                //   authorId: comment.author_id,
                //   authorName: comment.bi_user?.name || 'Unknown',
                //   content: comment.content,
                //   createdAt: comment.created_at,
                // }),
              },
            });
          } catch (logError) {
            console.error(`댓글 로그 생성 중 오류 (댓글 ID: ${comment.id}):`, logError);
            // 댓글 로그 생성 실패해도 계속 진행
          }
        }
      }

      // 게시글의 모든 댓글을 소프트 삭제 처리
      await tx.bi_comment.updateMany({
        where: { post_id: postId },
        data: {
          is_deleted: true,
          updated_at: new Date(),
        },
      });

      // 게시글 소프트 삭제
      await tx.bi_post.update({
        where: { id: postId },
        data: {
          is_deleted: true,
          updated_at: new Date(),
        },
      });
    });

    // 4. 성공 응답
    return NextResponse.json({
      success: true,
      message: '게시글이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: '게시글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}