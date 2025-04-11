import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const notices = await prisma.bi_notice.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    
    return NextResponse.json(notices);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}