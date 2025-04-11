import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.bi_level !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = parseInt((await params).id);
    const json = await request.json();
    
    const notice = await prisma.bi_notice.update({
      where: {
        id,
      },
      data: {
        title: json.title,
        content: json.content,
        date: json.date ? new Date(json.date) : undefined,
        published: json.published !== undefined ? json.published : undefined,
      },
    });
    
    return NextResponse.json(notice);
  } catch (error) {
        console.log(error)
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
  }
}