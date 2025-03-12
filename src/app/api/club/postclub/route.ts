import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    // 사용자 ID 가져오기
    const userId = session.user.mb_id as string;

    // 요청 본문 파싱
    const body = await request.json();

    const {
      type,
      name,
      description,
      location,
      maxMembers,
      regularDay,
      tags,
      rules,
      placeName,
      placeAddress,
      contactPhone,
      contactEmail,
      profileImageId,
      bannerImageId,
    } = body;

    // 필수 필드 검증
    if (!name || !location || !description) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      );
    }

    // 트랜잭션으로 여러 테이블에 데이터 생성
    const result = await prisma.$transaction(async (tx) => {
      // 1. 동호회 생성
      const club = await tx.club.create({
        data: {
          club_type: type,
          club_name: name,
          club_description: description,
          club_location: location,
          club_max_members: maxMembers || 50,
          club_regular_day: regularDay || null,
          club_rules: rules.filter((rule: string) => rule !== ''),
          club_place_name: placeName || null,
          club_place_address: placeAddress || null,
          club_contact_phone: contactPhone || null,
          club_contact_email: contactEmail || null,
          club_owner_id: userId,
          profile_image_id: profileImageId,
          banner_image_id: bannerImageId,
        },
      });

      // 2. 태그 생성
      if (tags && tags.length > 0) {
        const filteredTags = tags.filter((tag: string) => tag !== '');

        if (filteredTags.length > 0) {
          await tx.bi_club_tag.createMany({
            data: filteredTags.map((tag: string) => ({
              club_id: club.club_id,
              name: tag,
            })),
          });
        }
      }

      // 3. 자신을 멤버로 추가 (운영자로)
      await tx.bi_club_member.create({
        data: {
          club_id: club.club_id,
          user_id: userId,
          is_staff: true,
          staff_role: '회장',
        },
      });

      // 4. 동호회 전용 채팅방 생성
      await tx.bi_chat_room.create({
        data: {
          id: `room-${club.club_id}`,
          name: name,
          group_id: `group-${club.club_id}`,
          updated_at: new Date(),
        },
      });

      return club;
    });

    return NextResponse.json(
      {
        message: '동호회가 성공적으로 생성되었습니다',
        club: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('동호회 생성 중 오류 발생:', error);

    return NextResponse.json(
      {
        error: '동호회 생성 중 오류가 발생했습니다',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
