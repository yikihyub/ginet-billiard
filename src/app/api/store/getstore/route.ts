import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  comment: string | null;
  hourly_rate: number | null;
  open_time: string | null;
  close_time: string | null;
  coord_x: string | null;
  coord_y: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: '인증되지 않은 사용자입니다' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 세션에서 userId 가져오기
    const userId = session.user.mb_id;

    let stores;

    if (lat && lng) {
      // location 기반 검색 (반경 5km 내의 매장)
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radius = 0.05; // 약 5km 반경

      stores = await prisma.$queryRaw<Store[]>`
        SELECT 
          id,
          name,
          address,
          phone,
          comment,
          hourly_rate,
          open_time,
          close_time,
          coord_x,
          coord_y
        FROM ownerdb.bi_store
        WHERE 
          address IS NOT NULL
          AND coord_x IS NOT NULL
          AND coord_y IS NOT NULL
          AND CAST(coord_x AS DECIMAL) BETWEEN ${longitude - radius} AND ${longitude + radius}
          AND CAST(coord_y AS DECIMAL) BETWEEN ${latitude - radius} AND ${latitude + radius}
        ORDER BY 
          POW(CAST(coord_y AS DECIMAL) - ${latitude}, 2) + 
          POW(CAST(coord_x AS DECIMAL) - ${longitude}, 2)
        LIMIT 50
      `;
    } else {
      // bounds 기반 검색
      const swLat = parseFloat(searchParams.get('swLat') || '0');
      const swLng = parseFloat(searchParams.get('swLng') || '0');
      const neLat = parseFloat(searchParams.get('neLat') || '0');
      const neLng = parseFloat(searchParams.get('neLng') || '0');

      stores = await prisma.$queryRaw<Store[]>`
        SELECT 
          id,
          name,
          address,
          phone,
          comment,
          hourly_rate,
          open_time,
          close_time,
          coord_x,
          coord_y
        FROM ownerdb.bi_store
        WHERE 
          address IS NOT NULL
          AND coord_x IS NOT NULL
          AND coord_y IS NOT NULL
          AND CAST(coord_x AS DECIMAL) BETWEEN ${swLng} AND ${neLng}
          AND CAST(coord_y AS DECIMAL) BETWEEN ${swLat} AND ${neLat}
        ORDER BY 
          POW(CAST(coord_y AS DECIMAL) - ${(swLat + neLat) / 2}, 2) + 
          POW(CAST(coord_x AS DECIMAL) - ${(swLng + neLng) / 2}, 2)
        LIMIT 50
      `;
    }

    // 사용자가 즐겨찾기한 당구장 ID 목록 가져오기
    const favorites = await prisma.bi_favorites.findMany({
      where: {
        user_id: userId as string,
      },
      select: {
        place_id: true,
      },
    });

    // 즐겨찾기한 당구장 ID를 Set으로 변환하여 검색 효율성 향상
    const favoriteIds = new Set(favorites.map((fav) => fav.place_id));

    // 응답 데이터 포맷 변환
    const formattedStores = stores.map((store: any) => ({
      ...store,
      latitude: parseFloat(store.coord_y || '0'),
      longitude: parseFloat(store.coord_x || '0'),
      is_favorite: favoriteIds.has(store.id),
    }));

    return NextResponse.json(formattedStores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
