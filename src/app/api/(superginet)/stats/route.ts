import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 사용자 차단 해제 처리
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
    
    // 사용자 존재 여부 확인
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    
    if (!userExists) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }
    
    // 사용자 차단 해제 처리
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        is_banned: false,
        ban_reason: null,
        ban_expires_at: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_banned: true,
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('사용자 차단 해제 에러:', error);
    return NextResponse.json(
      { error: '사용자 차단 해제 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}