import { NextRequest, NextResponse } from 'next/server';
import { ClubData, DBResponse } from '@/types/(club)/db-club';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

// DB 데이터를 프론트엔드 형식으로 변환하는 함수
function transformClubData(
  dbResponse: DBResponse & { currentUserId?: string | null }
): ClubData {
  const {
    club,
    announcements,
    gallery,
    members,
    schedules,
    users,
    currentUserId,
  } = dbResponse;

  // 운영진과 일반 회원 분리
  const staffMembers = members.filter(
    (m) =>
      m.is_staff === true ||
      m.member_permission_level === 'admin' ||
      m.member_permission_level === 'owner'
  );

  const regularMembers = members.filter(
    (m) => m.is_staff !== true && m.member_permission_level === 'member'
  );

  // 활동 사진 매핑
  const galleryImages = gallery.map((g) => ({
    id: g.club_gallery_id,
    url: g.club_gallery_image_url,
    alt: g.club_gallery_description || `동호회 활동 사진 ${g.club_gallery_id}`,
  }));

  // 일정 매핑
  const mappedSchedules = schedules.map((s) => {
    const startDate = new Date(s.club_schedule_start_time);
    const endDate = s.club_schedule_end_time
      ? new Date(s.club_schedule_end_time)
      : null;

    return {
      id: s.club_schedule_id,
      type: s.club_schedule_is_competition ? 'competition' : 'regular',
      title: s.club_schedule_title,
      location: s.club_schedule_location || '',
      date: startDate.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
      }),
      time: startDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      endTime: endDate?.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      details: s.club_schedule_description ? [s.club_schedule_description] : [],
    };
  });

  // 공지사항 매핑
  const notices = announcements.map((a) => ({
    id: a.club_announcement_id,
    title: a.title,
    content: a.content,
    date: a.created_at.toISOString(),
  }));

  // 설립 연도 추출
  const establishedYear = club.club_founding_date
    ? club.club_founding_date.getFullYear().toString()
    : new Date().getFullYear().toString();

  // 멤버와 유저 정보 결합
  const staffWithUserInfo = staffMembers.map((member, index) => {
    const user = users[member.user_id] || {
      mb_name: `운영진${index + 1}`,
      mb_profile_image: null,
    };

    return {
      id: index + 1, // bi_club_member에는 고유 ID가 없으므로 인덱스 사용
      userId: member.user_id,
      name: user.mb_name,
      role:
        member.staff_role ||
        (member.member_permission_level === 'owner'
          ? '회장'
          : member.member_permission_level === 'admin'
            ? '총무'
            : '운영진'),
      since:
        member.joined_at.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
        }) + '부터',
      profileImage: user.mb_profile_image,
    };
  });

  // 현재 사용자가 관리자인지 확인
  const isAdmin = currentUserId
    ? members.some(
        (member) =>
          member.user_id === currentUserId &&
          (member.is_staff === true ||
            member.member_permission_level === 'admin' ||
            member.member_permission_level === 'owner')
      )
    : false;

  const membersWithUserInfo = regularMembers.map((member, index) => {
    const user = users[member.user_id] || {
      mb_name: `회원${index + 1}`,
      mb_profile_image: null,
    };

    return {
      id: index + 1, // 인덱스 기반 ID
      userId: member.user_id,
      isAdmin,
      name: user.mb_name,
      profileImage: user.mb_profile_image,
      joinDate: member.joined_at.toISOString(),
    };
  });

  return {
    id: club.club_id,
    name: club.club_name,
    bannerImage: '/logo/billard_web_banner.png', // 실제로는 다른 테이블에서 가져와야 할 수 있음
    location: club.club_location,
    memberCount: club.club_now_members || 0,
    memberLimit: club.club_max_members || 50,
    meetingSchedule: club.club_regular_day || '정기 모임 없음',
    establishedYear,
    description: club.club_description || '',
    isAdmin,
    // tags: tags.map((tag) => ({
    //   id: tag.tag_id,
    //   name: tag.tag_name,
    //   type: tag.tag_type,
    // })),
    rules: club.club_rules || [],
    venue: {
      name: club.club_place_name || '',
      address: club.club_place_address || '',
    },
    contact: {
      phone: club.club_contact_phone || '',
      email: club.club_contact_email || '',
    },
    schedules: mappedSchedules,
    gallery: {
      images: galleryImages,
    },
    staff: staffWithUserInfo,
    members: membersWithUserInfo,
    notices,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user.mb_id;

  if (isNaN(id)) {
    return NextResponse.json(
      { error: '유효하지 않은 동호회 ID입니다.' },
      { status: 400 }
    );
  }

  try {
    // Prisma를 사용한 데이터 조회
    const club = await prisma.club.findUnique({
      where: { club_id: id },
    });

    if (!club) {
      return NextResponse.json(
        { error: '동호회를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 관련 데이터 조회
    const [announcements, gallery, members, schedules] =
      await Promise.all([
        prisma.bi_club_announcement.findMany({
          where: { club_id: id },
          orderBy: { created_at: 'desc' },
        }),
        prisma.bi_club_gallery.findMany({
          where: { club_id: id },
        }),
        prisma.bi_club_member.findMany({
          where: { club_id: id },
        }),
        prisma.bi_club_schedule.findMany({
          where: { club_id: id },
          orderBy: { club_schedule_start_time: 'asc' },
        }),
        prisma.bi_club_tag.findMany({
          where: { club_id: id },
        }),
      ]);

    // 모든 관련 사용자 ID 수집
    const userIds = new Set<string>();
    members.forEach((m) => userIds.add(m.user_id));
    announcements.forEach((a) => userIds.add(a.created_by));
    gallery.forEach((g) => userIds.add(g.uploaded_by));

    // 관련 사용자 정보 조회
    const usersArray = await prisma.user.findMany({
      where: {
        mb_id: {
          in: Array.from(userIds),
        },
      },
    });

    // 사용자 배열을 ID를 키로 하는 객체로 변환
    const users = usersArray.reduce(
      (acc, user) => {
        if (user.mb_id !== null && user.mb_id !== undefined) {
          acc[user.mb_id] = user; // ✅ null 체크 후 사용
        }
        return acc;
      },
      {} as { [userId: string]: any }
    );

    // 변환하여 반환
    const clubData = transformClubData({
      club,
      announcements,
      gallery,
      members,
      schedules,
      users,
      currentUserId,
    });

    return NextResponse.json(clubData);
  } catch (error) {
    console.error('Error fetching club data:', error);
    return NextResponse.json(
      { error: '동호회 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
