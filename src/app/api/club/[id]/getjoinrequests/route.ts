import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.mb_id;
    const clubId = Number((await params).id);

    if (isNaN(clubId)) {
      return NextResponse.json(
        { error: '유효하지 않은 동호회 ID입니다.' },
        { status: 400 }
      );
    }

    // 사용자가 해당 클럽의 관리자인지 확인
    const isAdmin = await prisma.bi_club_member.findFirst({
      where: {
        club_id: clubId,
        user_id: userId!,
        member_permission_level: 'admin',
      },
    });

    if (!isAdmin) {
      return NextResponse.json(
        { error: '관리자만 가입 요청을 조회할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 가입 요청 목록 조회
    const joinRequests = await prisma.bi_club_join_request.findMany({
      where: {
        club_id: clubId,
        status: 'pending', // 대기 중인 요청만 조회
      },
      orderBy: {
        requested_at: 'desc', // 최신 요청 순으로 정렬
      },
      include: {
        bi_user: {
          select: {
            name: true, // 사용자 이름
            mb_id: true, // 사용자 ID
            email: true, // 사용자 이메일
            // mb_image: true,
          },
        },
      },
    });

    // 응답 데이터 가공
    const requests = joinRequests.map((request) => ({
      request_id: request.request_id,
      user_id: request.user_id,
      user_name: request.bi_user.name,
      user_email: request.bi_user.email,
      //   user_image: request.bi_user.mb_image,
      requested_at: request.requested_at,
      status: request.status,
    }));

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return NextResponse.json(
      { error: '가입 요청 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
