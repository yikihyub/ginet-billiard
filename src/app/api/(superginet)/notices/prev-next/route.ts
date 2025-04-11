import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const prev = await prisma.bi_notice.findFirst({
    where: { id: { lt: id } },
    orderBy: { id: 'desc' },
  });

  const next = await prisma.bi_notice.findFirst({
    where: { id: { gt: id } },
    orderBy: { id: 'asc' },
  });

  return NextResponse.json({ prev, next });
}