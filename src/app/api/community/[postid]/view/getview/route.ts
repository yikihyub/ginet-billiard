import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const postId = parseInt((await params).postId, 10);
    
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // 기본 조회수 정보
    const post = await prisma.bi_post.findUnique({
      where: { id: postId },
      select: { view_count: true },
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // 일별 통계 가져오기 (최근 7일)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    const dailyStats = await prisma.bi_view_stats_daily.findMany({
      where: {
        post_id: postId,
        view_date: { gte: sevenDaysAgo },
      },
      orderBy: { view_date: 'asc' },
    });
    
    // 시간별 통계 (오늘)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const hourlyStats = await prisma.bi_view_log.groupBy({
      by: ['post_id'],
      where: {
        post_id: postId,
        viewed_at: { gte: today },
      },
      _count: { id: true },
    });
    
    return NextResponse.json({
      total_views: post.view_count,
      daily_stats: dailyStats,
      today_views: hourlyStats[0]?._count?.id || 0,
    });
  } catch (error) {
    console.error('Error getting view statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch view statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}