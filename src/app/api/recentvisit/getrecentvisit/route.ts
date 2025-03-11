import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 최근 이용한 당구장 조회 (최근 예약 기준)
    const recentVisits = await prisma.bi_reservations.findMany({
      where: {
        bi_id: userId,
        status: 'confirmed', // 확정된 예약만 포함
      },
      select: {
        store_id: true,
        bi_store: true,
        reservation_date: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc', // 최근 예약순
      },
      take: 10, // 최근 10개만
      distinct: ['store_id'], // 같은 매장은 중복 제거
    });

    // 응답 데이터 포맷 변환
    const formattedVisits = recentVisits.map((visit) => ({
      id: visit.bi_store.id,
      name: visit.bi_store.name,
      address: visit.bi_store.address,
      phone: visit.bi_store.phone,
      hourly_rate: visit.bi_store.hourly_rate,
      open_time: visit.bi_store.open_time,
      close_time: visit.bi_store.close_time,
      coord_x: visit.bi_store.coord_x,
      coord_y: visit.bi_store.coord_y,
      latitude: visit.bi_store.coord_y
        ? parseFloat(visit.bi_store.coord_y)
        : null,
      longitude: visit.bi_store.coord_x
        ? parseFloat(visit.bi_store.coord_x)
        : null,
      visitDate: visit.reservation_date,
    }));

    return NextResponse.json(formattedVisits);
  } catch (error) {
    console.error('Error fetching recent visits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
