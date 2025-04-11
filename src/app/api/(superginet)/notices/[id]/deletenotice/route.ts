import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/authOptions';
import { prisma } from '@/lib/prisma';

export async function DELETE(
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
    
    await prisma.bi_notice.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({ message: 'Notice deleted successfully' });
  } catch (error) {
        console.log(error)
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
  }
}