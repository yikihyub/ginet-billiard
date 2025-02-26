import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');
  try {
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        mb_id: userId,
      },
      select: {
        name: true,
        email: true,
        user_four_ability: true,
        user_three_ability: true,
      },
    });

    return NextResponse.json(currentUser);
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
