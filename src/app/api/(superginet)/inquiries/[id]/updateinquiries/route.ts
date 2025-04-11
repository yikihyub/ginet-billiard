import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authOptions";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const session = await getServerSession(authOptions);

    // 관리자 권한 확인
    if (session?.user?.bi_level !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자만 답변을 등록할 수 있습니다" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { answer } = body;

    // 간단한 유효성 검사
    if (!answer) {
      return NextResponse.json(
        { error: "답변 내용을 입력해주세요" },
        { status: 400 }
      );
    }
    
    // 문의 존재 확인
    const inquiry = await prisma.bi_inquiry.findUnique({
      where: { id },
    });



    if (!inquiry) {
      return NextResponse.json(
        { error: "존재하지 않는 문의입니다" },
        { status: 404 }
      );
    }

    // 문의 답변 업데이트
    const updatedInquiry = await prisma.bi_inquiry.update({
      where: { id },
      data: {
        answer,
        status: "answered",
        updated_at: new Date(),
        answered_at: new Date(),
        answered_by: session.user?.mb_id,
      },
    });

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error("문의 답변 오류:", error);
    return NextResponse.json(
      { error: "답변 등록에 실패했습니다" },
      { status: 500 }
    );
  }
}
