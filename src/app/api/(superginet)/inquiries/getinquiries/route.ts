import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || undefined;
    const isAdmin = searchParams.get("isAdmin") === "true";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);
    const isUserAdmin = session?.user?.bi_level === "ADMIN";

    if (!isUserAdmin && !userId) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      );
    }

    // admin이 아니면 자신의 문의만 볼 수 있음
    const where = isUserAdmin && isAdmin ? {} : { user_id: userId };

    // 문의 목록 조회
    const [inquiries, total] = await Promise.all([
      prisma.bi_inquiry.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.bi_inquiry.count({ where }),
    ]);

    return NextResponse.json({
      inquiries,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("문의 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "문의 목록을 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}