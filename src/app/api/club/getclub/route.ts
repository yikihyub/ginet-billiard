import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터 가져오기
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const searchQuery = searchParams.get('query');

    // 필터링 조건 구성
    const whereClause: any = {};

    if (location) {
      whereClause.club_location = {
        contains: location,
      };
    }

    if (type) {
      whereClause.club_type = {
        contains: type,
      };
    }

    // 해시태그 기능
    // if (type) {
    //   whereClause.bi_club_tag = {
    //     some: {
    //       name: {
    //         equals: type,
    //       },
    //     },
    //   };
    // }

    if (searchQuery) {
      whereClause.OR = [
        {
          club_name: {
            contains: searchQuery,
          },
        },
        {
          club_description: {
            contains: searchQuery,
          },
        },
      ];
    }

    // 데이터베이스에서 동호회 정보 가져오기
    const clubs = await prisma.club.findMany({
      where: whereClause,
      include: {
        bi_club_tag: true,
        bi_club_member: {
          select: {
            user_id: true,
          },
        },
      },
      orderBy: {
        club_created_at: 'desc',
      },
    });

    // 응답 데이터 포맷팅
    const formattedClubs = clubs.map((club) => ({
      id: club.club_id.toString(),
      title: club.club_name,
      location: club.club_location,
      description: club.club_description,
      currentMembers: club.club_now_members || 0,
      maxMembers: club.club_max_members || 50,
      tags: club.bi_club_tag.map((tag) => tag.name),
      created: club.club_created_at,
      type: club.club_type,
    }));

    return NextResponse.json(formattedClubs);
  } catch (error: any) {
    console.error('동호회 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '동호회 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
