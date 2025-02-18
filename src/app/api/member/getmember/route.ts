import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { string } from 'zod';

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}

function toRad(degree: number) {
  return degree * (Math.PI / 180);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const maxDistance = searchParams.get('maxDistance') || '20';
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
        latitude: true,
        longitude: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log(currentUser);

    const allUsers = await prisma.user.findMany({
      where: {
        NOT: {
          mb_id: userId,
        },
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        location: true,
        user_four_ability: true,
        user_three_ability: true,
        preferred_time: true,
        mb_id: true,
      },
    });

    const usersWithDistance = allUsers
      .map((user) => {
        if (
          !user.latitude ||
          !user.longitude ||
          !currentUser.latitude ||
          !currentUser.longitude
        ) {
          return {
            ...user,
            distance: Infinity,
          };
        }

        return {
          ...user,
          distance: calculateDistance(
            currentUser.latitude,
            currentUser.longitude,
            user.latitude,
            user.longitude
          ),
        };
      })
      .filter((user) => user.distance <= Number(maxDistance))
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(usersWithDistance);
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
