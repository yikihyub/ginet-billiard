import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authOptions";

// 차단 해제 API
export async function DELETE(req: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const blockerId = session.user.mb_id;
    const { searchParams } = new URL(req.url);
    const blockedId = searchParams.get("blockedId");

    if (!blockedId) {
      return NextResponse.json(
        { error: "차단 해제할 사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 차단 데이터 찾기
    const block = await prisma.bi_user_block.findUnique({
      where: {
        blocker_id_blocked_id: {
          blocker_id: blockerId!,
          blocked_id: blockedId
        }
      }
    });

    if (!block) {
      return NextResponse.json(
        { error: "차단 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 삭제 대신 비활성화로 처리
    const updatedBlock = await prisma.bi_user_block.update({
      where: { block_id: block.block_id },
      data: { is_active: false }
    });

    return NextResponse.json(updatedBlock);
  } catch (error) {
    console.error("차단 해제 중 오류 발생:", error);
    return NextResponse.json(
      { error: "차단 해제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
