import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authOptions";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const session = await getServerSession(authOptions);
    
    // 관리자 권한 확인
    if (session?.user?.bi_level !== "admin") {
      return NextResponse.json(
        { error: "관리자만 문의를 삭제할 수 있습니다" },
        { status: 403 }
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
    
    // 문의 삭제
    await prisma.bi_inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("문의 삭제 오류:", error);
    return NextResponse.json(
      { error: "문의 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}