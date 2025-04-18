import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/config/authOptions';
import { ClubData, DBResponse } from '@/types/(club)/db-club';

// DB 데이터를 프론트엔드 형식으로 변환하는 함수
function transformClubData(
  dbResponse: DBResponse & { currentUserId?: string | null }
): ClubData | null {
  try {
    if (!dbResponse || !dbResponse.club) {
      console.error('Invalid dbResponse or missing club data');
      return null;
    }

    const {
      club,
      announcements = [],
      gallery = [],
      members = [],
      schedules = [],
      users = {},
      currentUserId,
      tags = [],
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
      try {
        const startDate = new Date(s.club_schedule_start_time);
        const endDate = s.club_schedule_end_time
          ? new Date(s.club_schedule_end_time)
          : null;

        return {
          id: s.club_schedule_id,
          type: s.club_schedule_is_competition ? 'competition' : 'regular',
          title: s.club_schedule_title || '',
          location: s.club_schedule_location || '',
          date: startDate.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
          }),
          time: startDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          endTime: endDate ? endDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }) : undefined,
          details: s.club_schedule_description ? [s.club_schedule_description] : [],
        };
      } catch (e) {
        console.error('Error mapping schedule:', e);
        return {
          id: s.club_schedule_id,
          type: 'regular',
          title: s.club_schedule_title || '',
          location: '',
          date: 'Date error',
          time: 'Time error',
          endTime: undefined,
          details: [],
        };
      }
    });

    // 공지사항 매핑
    const notices = announcements.map((a) => {
      try {
        return {
          id: a.club_announcement_id,
          title: a.title || '',
          content: a.content || '',
          date: a.created_at?.toISOString() || new Date().toISOString(),
        };
      } catch (e) {
        console.error('Error mapping announcement:', e);
        return {
          id: a.club_announcement_id,
          title: a.title || '',
          content: a.content || '',
          date: new Date().toISOString(),
        };
      }
    });

    // 설립 연도 추출
    let establishedYear;
    try {
      establishedYear = club.club_founding_date
        ? club.club_founding_date.getFullYear().toString()
        : new Date().getFullYear().toString();
    } catch (e) {
      console.error('Error getting established year:', e);
      establishedYear = new Date().getFullYear().toString();
    }

    // 멤버와 유저 정보 결합
    const staffWithUserInfo = staffMembers.map((member, index) => {
      try {
        const user = (member.user_id && users[member.user_id]) || {
          mb_name: `운영진${index + 1}`,
          mb_profile_image: null,
        };

        return {
          id: index + 1,
          userId: member.user_id || '',
          name: user.mb_name || `운영진${index + 1}`,
          role:
            member.staff_role ||
            (member.member_permission_level === 'owner'
              ? '회장'
              : member.member_permission_level === 'admin'
                ? '총무'
                : '운영진'),
          since: member.joined_at
            ? member.joined_at.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
              }) + '부터'
            : '',
          profileImage: user.mb_profile_image || null,
        };
      } catch (e) {
        console.error('Error mapping staff member:', e);
        return {
          id: index + 1,
          userId: member.user_id || '',
          name: `운영진${index + 1}`,
          role: '운영진',
          since: '',
          profileImage: null,
        };
      }
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
      try {
        const user = (member.user_id && users[member.user_id]) || {
          mb_name: `회원${index + 1}`,
          mb_profile_image: null,
        };

        return {
          id: index + 1,
          userId: member.user_id || '',
          isAdmin,
          name: user.mb_name || `회원${index + 1}`,
          profileImage: user.mb_profile_image || null,
          joinDate: member.joined_at?.toISOString() || new Date().toISOString(),
        };
      } catch (e) {
        console.error('Error mapping regular member:', e);
        return {
          id: index + 1,
          userId: member.user_id || '',
          isAdmin,
          name: `회원${index + 1}`,
          profileImage: null,
          joinDate: new Date().toISOString(),
        };
      }
    });

    // Tag mapping with error handling
    const mappedTags = tags.map((tag) => {
      try {
        return {
          id: tag.tag_id || tag.tag_id || 0,
          name: tag.tag_name || tag.tag_name || '',
        };
      } catch (e) {
        console.error('Error mapping tag:', e);
        return {
          id: 0,
          name: '',
          type: 'general',
        };
      }
    });

    const result = {
      id: club.club_id,
      name: club.club_name || '',
      bannerImage: '/logo/billard_web_banner.png',
      location: club.club_location || '',
      memberCount: club.club_now_members || 0,
      memberLimit: club.club_max_members || 50,
      meetingSchedule: club.club_regular_day || '정기 모임 없음',
      establishedYear,
      description: club.club_description || '',
      isAdmin,
      tags: mappedTags,
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
    return result;
  } catch (error) {
    console.error('Error in transformClubData:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.mb_id;

    if (isNaN(id)) {
      console.error('Invalid club ID:', resolvedParams.id);
      return NextResponse.json(
        { error: '유효하지 않은 동호회 ID입니다.' },
        { status: 400 }
      );
    }

    const club = await prisma.club.findUnique({
      where: { club_id: id },
    });
    
    if (!club) {
      return NextResponse.json(
        { error: '동호회를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    try {
      const [announcements, gallery, members, schedules, rawTags] =
        await Promise.all([
          prisma.bi_club_announcement.findMany({
            where: { club_id: id },
            orderBy: { created_at: 'desc' },
          }).catch(e => {
            console.error('Error fetching announcements:', e);
            return [];
          }),
          
          prisma.bi_club_gallery.findMany({
            where: { club_id: id },
          }).catch(e => {
            console.error('Error fetching gallery:', e);
            return [];
          }),
          
          prisma.bi_club_member.findMany({
            where: { club_id: id },
          }).catch(e => {
            console.error('Error fetching members:', e);
            return [];
          }),
          
          prisma.bi_club_schedule.findMany({
            where: { club_id: id },
            orderBy: { club_schedule_start_time: 'asc' },
          }).catch(e => {
            console.error('Error fetching schedules:', e);
            return [];
          }),
          
          prisma.bi_club_tag.findMany({
            where: { club_id: id },
          }).catch(e => {
            console.error('Error fetching tags:', e);
            return [];
          }),
        ]);

      // 3. Map rawTags to match ClubTagModel structure
      const tags = rawTags.map(tag => ({
        tag_id: tag.club_tag_id || 0,
        tag_name: tag.name || '',

      }));

      const userIds = new Set<string>();
      
      members.forEach((m) => {
        if (m.user_id) userIds.add(m.user_id);
      });
      
      announcements.forEach((a) => {
        if (a.created_by) userIds.add(a.created_by);
      });
      
      gallery.forEach((g) => {
        if (g.uploaded_by) userIds.add(g.uploaded_by);
      });

      // 5. 관련 사용자 정보 조회
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let usersArray: any[] = [];
      
      if (userIds.size > 0) {
        usersArray = await prisma.user.findMany({
          where: {
            mb_id: {
              in: Array.from(userIds),
            },
          },
        }).catch(e => {
          console.error('Error fetching users:', e);
          return [];
        });
      }

      // 6. 사용자 배열을 ID를 키로 하는 객체로 변환
      const users = usersArray.reduce(
        (acc, user) => {
          if (user.mb_id) {
            acc[user.mb_id] = user;
          }
          return acc;
        },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as { [userId: string]: any }
      );

      const clubData = transformClubData({
        club,
        announcements,
        gallery,
        members,
        schedules,
        tags,
        users,
        currentUserId,
      });

      if (!clubData) {
        console.error('Failed to transform club data');
        return NextResponse.json(
          { error: '동호회 데이터 변환 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(clubData);
    } catch (dataError) {
      console.error('Error in data fetching/processing:', dataError);
      return NextResponse.json(
        { error: '동호회 관련 데이터 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET club route:', error);
    return NextResponse.json(
      { error: '동호회 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}