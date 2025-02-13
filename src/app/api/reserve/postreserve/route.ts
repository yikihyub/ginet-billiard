// app/api/reservations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      store_id,
      table_number,
      customer_name,
      phone,
      reservation_date,
      start_time,
      end_time,
      bi_id,
    } = body;

    // 데이터 유효성 검사
    if (
      !store_id ||
      !table_number ||
      !customer_name ||
      !phone ||
      !reservation_date ||
      !start_time ||
      !end_time
    ) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // DateTime 문자열 생성
    const createDateTime = (date: string, time: string) => {
      const [hours, minutes] = time.split(':');
      const dateObj = new Date(date);
      dateObj.setHours(Number(hours), Number(minutes), 0, 0);
      return dateObj;
    };

    const startDateTime = createDateTime(reservation_date, start_time);
    const endDateTime = createDateTime(reservation_date, end_time);

    // 해당 시간에 이미 예약이 있는지 확인
    const existingReservation = await prisma.bi_reservations.findFirst({
      where: {
        store_id: Number(store_id),
        table_number: Number(table_number),
        reservation_date: new Date(reservation_date),
        OR: [
          {
            AND: [
              { start_time: { lte: startDateTime } },
              { end_time: { gt: startDateTime } },
            ],
          },
          {
            AND: [
              { start_time: { lt: endDateTime } },
              { end_time: { gte: endDateTime } },
            ],
          },
        ],
        status: 'confirmed',
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: '해당 시간에 이미 예약이 존재합니다.' },
        { status: 409 }
      );
    }

    // 예약 생성
    const reservation = await prisma.bi_reservations.create({
      data: {
        store_id: Number(store_id),
        table_number: Number(table_number),
        customer_name,
        phone,
        reservation_date: new Date(reservation_date),
        start_time: startDateTime,
        end_time: endDateTime,
        bi_id: bi_id || undefined,
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json(
      { error: '예약 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
