import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postid: string }>}
) {
  try {
    const postId = parseInt((await params).postid, 10);
    
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // 게시글이 존재하는지 확인
    const post = await prisma.bi_post.findUnique({
      where: { id: postId, is_deleted: false },
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // 현재 세션 정보 가져오기 (로그인한 사용자)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.mb_id;
    
    // 헤더에서 IP 주소 및 User-Agent 가져오기
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 오늘 시작 시간 (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingView = await prisma.bi_view_log.findFirst({
      where: {
        post_id: postId,
        ip_address: ip,
        viewed_at: {
          gte: today
        }
      }
    });

    if (!existingView) {
      await prisma.$transaction([
        // 조회 로그 생성
        prisma.bi_view_log.create({
          data: {
            post_id: postId,
            user_id: userId,
            ip_address: ip,
            user_agent: userAgent,
          },
        }),
        
        // 게시글의 조회수 증가
        prisma.bi_post.update({
          where: { id: postId },
          data: { view_count: { increment: 1 } },
        }),
        
        // 일별 통계 업데이트
        prisma.bi_view_stats_daily.upsert({
          where: {
            post_id_view_date: {
              post_id: postId,
              view_date: today,
            },
          },
          update: {
            view_count: { increment: 1 },
          },
          create: {
            post_id: postId,
            view_date: today,
            view_count: 1,
            unique_users: userId ? 1 : 0,
          },
        }),
      ]);
      
      console.log(`조회수 증가: 게시글 ID ${postId}, IP ${ip}`);
    } else {
      console.log(`중복 조회 무시: 게시글 ID ${postId}, IP ${ip}`);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording view:', error);
    return NextResponse.json(
      { error: 'Failed to record view' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
