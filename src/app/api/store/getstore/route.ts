import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // 응답 데이터 포맷 변환
    const formattedStores = stores.map((store) => ({
      ...store,
      latitude: parseFloat(store.coord_y || '0'),
      longitude: parseFloat(store.coord_x || '0'),
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
