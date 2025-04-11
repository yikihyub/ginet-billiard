import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/config/authOptions';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const clubId = searchParams.get('clubId');

    if (!clubId) {
      return NextResponse.json(
        { error: '동호회 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const clubNumId = Number(clubId);

    if (isNaN(clubNumId)) {
      return NextResponse.json(
        { error: '유효하지 않은 동호회 ID입니다.' },
        { status: 400 }
      );
    }

    // 클럽이 존재하는지 확인
    const club = await prisma.club.findUnique({
      where: { club_id: clubNumId },
    });

    if (!club) {
      return NextResponse.json(
        { error: '존재하지 않는 동호회입니다.' },
        { status: 404 }
      );
    }

    // 사용자가 이미 회원인지 확인
    const existingMember = await prisma.bi_club_member.findUnique({
      where: {
        club_id_user_id: {
          club_id: clubNumId,
          user_id: userId!,
        },
      },
    });

    console.log(existingMember)

    if (existingMember) {
      return NextResponse.json({ status: 'member' });
    }

    // 가입 요청 상태 확인
    const pendingRequest = await prisma.bi_club_join_request.findFirst({
      where: {
        club_id: clubNumId,
        user_id: userId!,
        status: 'pending',
      },
    });

    if (pendingRequest) {
      return NextResponse.json({ status: 'pending' });
    }

    // 둘 다 아닌 경우 - 가입되지 않은 상태
    return NextResponse.json({ status: 'none' });
  } catch (error) {
    console.error('Error checking membership status:', error);
    return NextResponse.json(
      { error: '회원 상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
