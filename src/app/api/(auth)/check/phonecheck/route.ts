import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    console.log(phone);

    if (!phone) {
      return NextResponse.json(
        { message: '핸드폰 번호가 필요합니다.', isAvailable: false },
        { status: 400 }
      );
    }

    // DB에서 이메일 중복 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        phonenum: phone,
      },
    });

    return NextResponse.json({
      isAvailable: !existingUser,
      message: existingUser
        ? '기존에 등록된 휴대폰 번호입니다.'
        : '사용 가능한 휴대폰 번호입니다.',
    });
  } catch (error) {
    console.error('휴대폰번호 확인 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.', isAvailable: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
