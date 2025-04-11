import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authOptions";
import { prisma } from "@/lib/prisma";


// GET - 특정 문의 상세 정보
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const session = await getServerSession(authOptions);
    
    // 문의 조회
    const inquiry = await prisma.bi_inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "존재하지 않는 문의입니다" },
        { status: 404 }
      );
    }

    // 권한 확인: 관리자이거나 본인의 문의만 조회 가능
    if (
      session?.user?.bi_level !== "admin" &&
      inquiry.user_id !== session?.user?.id
    ) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("문의 상세 조회 오류:", error);
    return NextResponse.json(
      { error: "문의를 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}
