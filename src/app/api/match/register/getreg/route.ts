import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const matches = await prisma.bi_match_reg.findMany({
      where: { status: 'PENDING' },
      include: {
        bi_user: true,
        bi_match_participant: {
          include: {
            bi_user: true,
          },
        },
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return NextResponse.json(
      { message: '매치 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
