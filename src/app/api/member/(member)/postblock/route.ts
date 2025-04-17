import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authOptions";

// 사용자 차단 API
export async function POST(req: NextRequest) {
  try {
    // 세션 확인으로 인증된 사용자인지 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const blockerId = session.user.mb_id;
    const body = await req.json();
    const { blockedId, blockReason } = body;

    // 자기 자신을 차단하려는 경우 방지
    if (blockerId === blockedId) {
      return NextResponse.json(
        { error: "자기 자신을 차단할 수 없습니다." },
        { status: 400 }
      );
    }

    // 차단할 사용자가 존재하는지 확인
    const blockedUser = await prisma.user.findUnique({
      where: { mb_id: blockedId }
    });

    if (!blockedUser) {
      return NextResponse.json(
        { error: "차단할 사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이미 차단되어 있는지 확인
    const existingBlock = await prisma.bi_user_block.findUnique({
      where: {
        blocker_id_blocked_id: {
          blocker_id: blockerId!,
          blocked_id: blockedId
        }
      }
    });

    if (existingBlock) {
      // 이미 차단되어 있지만 비활성화된 경우 다시 활성화
      if (!existingBlock.is_active) {
        const updatedBlock = await prisma.bi_user_block.update({
          where: { block_id: existingBlock.block_id },
          data: { 
            is_active: true,
            block_reason: blockReason || existingBlock.block_reason
          }
        });
        return NextResponse.json(updatedBlock);
      }
      
      return NextResponse.json(
        { error: "이미 차단한 사용자입니다." },
        { status: 409 }
      );
    }

    // 새로운 차단 생성
    const newBlock = await prisma.bi_user_block.create({
      data: {
        blocker_id: blockerId!,
        blocked_id: blockedId,
        block_reason: blockReason
      }
    });

    return NextResponse.json(newBlock);
  } catch (error) {
    console.error("사용자 차단 중 오류 발생:", error);
    return NextResponse.json(
      { error: "사용자 차단 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}