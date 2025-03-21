import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { headers } from 'next/headers';

export async function PUT(
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

    // 2. 게시글이 존재하는지 확인하고, 작성자가 맞는지 검증
    const existingPost = await prisma.bi_post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 작성자 또는 관리자만 수정 가능
    const isAdmin = session.user.bi_level === 'ADMIN';
    if (existingPost.author_id !== userId && !isAdmin) {
      return NextResponse.json(
        { error: '게시글을 수정할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 3. 요청 데이터 파싱
    const { title, content, category_id, tags, imageIds } = await request.json();

    // 필수 필드 검증
    if (!title?.trim() || !content?.trim() || !category_id) {
      return NextResponse.json(
        { error: '제목, 내용, 카테고리는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 헤더에서 IP 주소 및 User-Agent 가져오기
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 4. 트랜잭션으로 게시글 및 관련 데이터 업데이트
    await prisma.$transaction(async (tx) => {
      // 로그 기록 추가
      await tx.bi_post_log.create({
        data: {
          post_id: postId,
          author_id: existingPost.author_id || '',
          title: existingPost.title,
          content: existingPost.content,
          category_id: existingPost.category_id,
          action: 'update',
          user_id: userId || '',
          ip_address: ip,
          user_agent: userAgent,
          original_created_at: existingPost.created_at,
          original_updated_at: existingPost.updated_at
        }
      });

      // 4-1. 게시글 업데이트
      await tx.bi_post.update({
        where: { id: postId },
        data: {
          title,
          content,
          category_id: parseInt(category_id, 10),
          updated_at: new Date(),
        },
      });

      // 4-2. 기존 태그 삭제
      await tx.bi_post_tag.deleteMany({
        where: { post_id: postId },
      });

      // 4-3. 새 태그 추가
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // 태그가 있는지 확인하고 없으면 생성
          let tag = await tx.bi_tag.findFirst({
            where: { name: tagName },
          });

          if (!tag) {
            tag = await tx.bi_tag.create({
              data: { name: tagName },
            });
          }

          // 게시글-태그 연결
          await tx.bi_post_tag.create({
            data: {
              post_id: postId,
              tag_id: tag.id,
            },
          });
        }
      }

      // 4-4. 이미지 처리
      // 기존 이미지 관계 모두 삭제
      await tx.bi_post_image.deleteMany({
        where: { post_id: postId },
      });

      // 새 이미지 관계 생성 (선택된 이미지만)
      if (imageIds && imageIds.length > 0) {
        for (let i = 0; i < imageIds.length; i++) {
          await tx.bi_post_image.create({
            data: {
              post_id: postId,
              image_id: imageIds[i],
              order: i,
            },
          });
        }
      }
    });

    // 5. 성공 응답
    return NextResponse.json({
      success: true,
      message: '게시글이 성공적으로 수정되었습니다.',
      post_id: postId,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: '게시글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}