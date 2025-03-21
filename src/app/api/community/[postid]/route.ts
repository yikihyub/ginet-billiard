import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params } : {params:Promise<{postid:string}>}) {
  try {
    const postId = (await params).postid;
    const id = parseInt(postId, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const post = await prisma.bi_post.findUnique({
      where: {
        id: id,
        is_deleted: false,
      },
      include: {
        bi_user: {
          select: {
            id: true,
            name: true,
            profile_image: true,
          },
        },
        bi_category: true,
        bi_post_image: true,
        bi_post_tag: {
          include: {
            bi_tag: true,
          },
        },
        _count: {
          select: {
            bi_comment: true,
            bi_post_like: true,
            bi_bookmark: true,
          },
        },
      },
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // 게시글 데이터 반환
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}