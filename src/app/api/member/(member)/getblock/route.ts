import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authOptions";

export async function GET() {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 내가 차단한 사용자 목록 조회
    const blockedUsers = await prisma.bi_user_block.findMany({
    where: {
        blocker_id: userId,
        is_active: true
    },
    orderBy: {
        block_date: 'desc'
    }
    });

    // 차단된 사용자 ID 목록
    // const blockedUserIds = blockedUsers.map(block => block.blocked_id);

    // 해당 사용자들의 정보를 별도로 조회
    // const blockedUserDetails = await prisma.user.findMany({
    // where: {
    //     mb_id: {
    //     in: blockedUserIds
    //     }
    // },
    // select: {
    //     mb_id: true,
    //     name: true,
    // }
    // });

    return NextResponse.json(blockedUsers);
  } catch (error) {
    console.error("차단 목록 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "차단 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}