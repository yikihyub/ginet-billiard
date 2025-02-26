import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, latitude, longitude } = await request.json();

    const updatedUser = await prisma.$executeRaw`
      UPDATE "User"
      SET 
        location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
        latitude = ${latitude},
        longitude = ${longitude},
        "updatedAt" = NOW()
      WHERE id = ${userId}
    `;

    return NextResponse.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}
