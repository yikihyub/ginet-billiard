import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';
import { prisma } from '@/lib/prisma';

// JSON 요청 구조에 대한 타입 선언
interface CreateNoticeRequest {
  title: string;
  content: string;
  date?: string | Date;
  updatedAt?: string | Date;
  published?: boolean;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 관리자 권한 확인
    if (!session || session.user.bi_level !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json: CreateNoticeRequest = await request.json();

    const notice = await prisma.bi_notice.create({
      data: {
        title: json.title,
        content: json.content,
        date: json.date ? new Date(json.date) : new Date(),
        updatedAt: json.date ? new Date(json.date) : new Date(),
        published: json.published !== undefined ? json.published : true,
      },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error('Failed to create notice:', error);
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}
