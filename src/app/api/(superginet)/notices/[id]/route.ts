import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    
    const notice = await prisma.bi_notice.findUnique({
      where: {
        id,
      },
    });
    
    if (!notice) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }
    
    return NextResponse.json(notice);
  } catch (error) {
        console.log(error)
    return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 });
  }
}
