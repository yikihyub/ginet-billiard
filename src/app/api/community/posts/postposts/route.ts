import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { title, content, category_id, tags = [], imageIds = [] } = body;
    
    // 필수 데이터 검증
    if (!title || !content || !category_id) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 게시글 생성
    const post = await prisma.bi_post.create({
      data: {
        title,
        content,
        author_id: session.user.mb_id,
        category_id: parseInt(category_id),
        // location: session.user.location || null,
        // latitude: session.user.latitude || null,
        // longitude: session.user.longitude || null,
      },
    });
    
    // 이미지 연결
    if (imageIds.length > 0) {
      await Promise.all(
        imageIds.map((imageId: number, index: number) => (
          prisma.bi_post_image.create({
            data: {
              post_id: post.id,
              image_id: imageId,
              order: index,
            },
          })
        ))
      );
    }
    
    // 태그 처리
    if (tags.length > 0) {
      await Promise.all(
        tags.map(async (tagName: string) => {
          // 태그가 이미 존재하는지 확인, 없으면 생성
          let tag = await prisma.bi_tag.findUnique({
            where: { name: tagName },
          });
          
          if (!tag) {
            tag = await prisma.bi_tag.create({
              data: { name: tagName },
            });
          }
          
          // 게시글과 태그 연결
          await prisma.bi_post_tag.create({
            data: {
              post_id: post.id,
              tag_id: tag.id,
            },
          });
        })
      );
    }
    
    return NextResponse.json({ 
      message: 'Post created successfully',
      post_id: post.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}