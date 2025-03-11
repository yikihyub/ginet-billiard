import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function POST(request: NextRequest) {
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    // 요청 바디에서 requestId와 status 가져오기
    const { id, requestId, status } = await request.json();

    const userId = session.user.mb_id;
    const clubId = Number(id);

    console.log('clubid:', clubId);
    console.log('requestId:', requestId);
    console.log('status:', status);

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
        { error: '관리자만 가입 요청을 처리할 수 있습니다.' },
        { status: 403 }
      );
    }

    if (
      !requestId ||
      !status ||
      (status !== 'approved' && status !== 'rejected')
    ) {
      return NextResponse.json(
        { error: '유효하지 않은 요청입니다.' },
        { status: 400 }
      );
    }

    // 해당 요청이 존재하는지 확인
    const joinRequest = await prisma.bi_club_join_request.findUnique({
      where: {
        request_id: requestId,
      },
    });

    if (!joinRequest || joinRequest.club_id !== clubId) {
      return NextResponse.json(
        { error: '존재하지 않는 가입 요청입니다.' },
        { status: 404 }
      );
    }

    // 이미 처리된 요청인지 확인
    if (joinRequest.status !== 'pending') {
      return NextResponse.json(
        { error: '이미 처리된 가입 요청입니다.' },
        { status: 400 }
      );
    }

    // 트랜잭션으로 처리 (승인인 경우 회원으로 추가)
    const result = await prisma.$transaction(async (tx) => {
      // 요청 상태 업데이트
      const updatedRequest = await tx.bi_club_join_request.update({
        where: {
          request_id: requestId,
        },
        data: {
          status: status,
        },
      });

      // 승인인 경우 회원으로 추가
      if (status === 'approved') {
        await tx.bi_club_member.create({
          data: {
            club_id: clubId,
            user_id: joinRequest.user_id,
            member_permission_level: 'member',
            staff_role: '일반회원',
            joined_at: new Date(),
          },
        });

        // 클럽의 현재 회원 수 증가
        await tx.club.update({
          where: {
            club_id: clubId,
          },
          data: {
            club_now_members: {
              increment: 1, // 현재 회원 수를 1 증가
            },
          },
        });
      }

      return updatedRequest;
    });

    return NextResponse.json({
      success: true,
      message:
        status === 'approved'
          ? '가입 요청이 승인되었습니다.'
          : '가입 요청이 거절되었습니다.',
      request: result,
    });
  } catch (error) {
    console.error('Error processing join request:', error);
    return NextResponse.json(
      { error: '가입 요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
