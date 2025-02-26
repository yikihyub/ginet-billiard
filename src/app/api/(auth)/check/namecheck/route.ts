import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: '사용하실 닉네임이 필요합니다.', isAvailable: false },
        { status: 400 }
      );
    }

    // DB에서 이메일 중복 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    return NextResponse.json({
      isAvailable: !existingUser,
      message: existingUser
        ? '이미 사용 중인 닉네임입니다.'
        : '사용 가능한 닉네임입니다.',
    });
  } catch (error) {
    console.error('닉네임 확인 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.', isAvailable: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
