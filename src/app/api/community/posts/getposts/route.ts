import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const filter = searchParams.get('filter') || 'recent';
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;

    const where: any = {
      is_deleted: false,
    };
    
    if (category && category !== 'all') {
      const categoryObj = await prisma.bi_category.findFirst({
        where: { name: category },
      });
      if (categoryObj) {
        where.category_id = categoryObj.id;
      }
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // 정렬 조건
    let orderBy: any = {};
    switch (filter) {
      case 'popular':
        orderBy = { is_hot: 'desc' };
        break;
      case 'comments':
        orderBy = { comments: { _count: 'desc' } };
        break;
      case 'views':
        orderBy = { view_count: 'desc' };
        break;
      case 'recent':
      default:
        orderBy = { created_at: 'desc' };
    }
    
    // 게시글 조회
    const posts = await prisma.bi_post.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        bi_user: {
          select: {
            id: true,
            name: true,
            profile_image: true,
          },
        },
        bi_category: true,
        _count: {
          select: {
            bi_comment: true,
            bi_post_like: true,
          },
        },
        bi_post_image: {
          select: {
            id: true,
            image_id: true,
          },
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
      },
    });
    
    // 게시글 총 개수
    const totalPosts = await prisma.bi_post.count({ where });
    
    // 세션 정보 가져오기
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // 사용자의 좋아요, 북마크 정보 추가
    const postsWithUserActions = await Promise.all(
      posts.map(async (post) => {
        let liked = false;
        let bookmarked = false;
        
        if (userId) {
          // 좋아요 여부 확인
          const like = await prisma.bi_post_like.findUnique({
            where: {
              post_id_user_id: {
                post_id: post.id,
                user_id: parseInt(userId),
              },
            },
          });
          
          // 북마크 여부 확인
          const bookmark = await prisma.bi_bookmark.findUnique({
            where: {
              post_id_user_id: {
                post_id: post.id,
                user_id: parseInt(userId),
              },
            },
          });
          
          liked = !!like;
          bookmarked = !!bookmark;
        }
        
        return {
          ...post,
          commentCount: post._count.bi_comment,
          likeCount: post._count.bi_post_like,
          liked,
          bookmarked,
          imageSrc: post.bi_post_image[0]?.image_id || null,
          hasImage: post.bi_post_image.length > 0,
          _count: undefined, // 원본 _count 제거
        };
      })
    );
    
    return NextResponse.json({
      posts: postsWithUserActions,
      total: totalPosts,
      page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
