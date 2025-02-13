// /api/store/getstore/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const swLat = parseFloat(searchParams.get('swLat') || '0');
//     const swLng = parseFloat(searchParams.get('swLng') || '0');
//     const neLat = parseFloat(searchParams.get('neLat') || '0');
//     const neLng = parseFloat(searchParams.get('neLng') || '0');

//     // viewport 범위에 있는 데이터를 가져오도록 수정
//     const stores = await prisma.$queryRaw`
//       SELECT
//         id,
//         name,
//         address,
//         phone,
//         comment,
//         hourly_rate,
//         open_time,
//         close_time,
//         CASE
//           WHEN geom IS NOT NULL THEN public.ST_X(geom)::float
//           ELSE null
//         END as longitude,
//         CASE
//           WHEN geom IS NOT NULL THEN public.ST_Y(geom)::float
//           ELSE null
//         END as latitude
//       FROM ownerdb.bi_store
//       WHERE
//         public.ST_Intersects(
//           geom,
//           public.ST_MakeEnvelope(${swLng}, ${swLat}, ${neLng}, ${neLat}, 4326)
//         )
//       ORDER BY created_at DESC
//       LIMIT 50;
//     `;

//     return NextResponse.json(stores);
//   } catch (error) {
//     console.error('Error fetching stores:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const stores = await prisma.$queryRaw`
      SELECT 
        id,
        name,
        address,
        phone,
        comment,
        hourly_rate,
        open_time,
        close_time
      FROM ownerdb.bi_store
      WHERE address IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 50;
    `;

    return NextResponse.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
