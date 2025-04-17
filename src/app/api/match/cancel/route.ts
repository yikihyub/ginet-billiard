import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { matchId, reason } = body;

  if (!matchId || !reason) {
    return NextResponse.json({ error: 'matchId and reason are required' }, { status: 400 });
  }

  try {
    const match = await prisma.bi_match.findUnique({
      where: { match_id: Number(matchId) },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // 이미 취소된 경기라면 중복 방지
    if (match.match_status === 'CANCELLED') {
      return NextResponse.json({ error: 'Match already cancelled' }, { status: 409 });
    }

    await prisma.bi_match.update({
      where: { match_id: Number(matchId) },
      data: {
        request_status:'CANCELLED',
        match_status: 'CANCELLED',
        cancel_reason: reason,
        cancelled_by: session.user.mb_id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[MATCH_CANCEL_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
