import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cuid from "cuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, userId } = body;
    const cuId = cuid();
    console.log(name)
    console.log(email)
    console.log(subject)
    console.log(message)
    console.log(userId)
    
    // 간단한 유효성 검사
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다" },
        { status: 400 }
      );
    }

    
    // 문의 생성
    const inquiry = await prisma.bi_inquiry.create({
      data: {
        id: cuId,
        name,
        email,
        subject,
        message,
        user_id: userId,
        status: "pending",
      },
    });

    return NextResponse.json(
      { success: true, inquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("문의 생성 오류:", error);
    return NextResponse.json(
      { error: "문의 등록에 실패했습니다" },
      { status: 500 }
    );
  }
}