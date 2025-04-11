import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 사용자 차단 처리
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = parseInt((await params).id, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다' },
        { status: 400 }
      );
    }
    
    // 요청 본문 파싱
    const body = await request.json();
    const { reason, duration } = body;
    
    if (!reason) {
      return NextResponse.json(
        { error: '차단 사유는 필수 항목입니다' },
        { status: 400 }
      );
    }
    
    // 사용자 존재 여부 확인
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    
    console.log(userExists)

    if (!userExists) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }
    
    // 만료 날짜 계산 (duration이 -2면 영구 차단)
    let banExpiresAt = null;
    if (duration > 0) {
      banExpiresAt = new Date();
      banExpiresAt.setDate(banExpiresAt.getDate() + duration);
    }
    
    // 사용자 차단 처리
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        is_banned: true,
        ban_reason: reason,
        ban_expires_at: banExpiresAt,
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_banned: true,
        ban_reason: true,
        ban_expires_at: true,
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('사용자 차단 에러:', error);
    return NextResponse.json(
      { error: '사용자 차단 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}