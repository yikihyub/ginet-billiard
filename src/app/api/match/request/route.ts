import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { error: '요청 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.player1_id || !body.player2_id || !body.preferred_date) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const {
      player1_id, // 본인 아이디
      player2_id, // 상대방 아이디
      preferred_date,
      message,
      game_type,
      location,
    } = body;

    // 트랜잭션 사용하여 매치 생성, 매치 요청, 알림까지 한번에 처리
    const result = await prisma.$transaction(async (tx) => {
      // 1. 신청자 정보 조회
      const requester = await tx.user.findUnique({
        where: { mb_id: player1_id },
        select: { id: true, name: true },
      });

      if (!requester) {
        throw new Error('신청자 정보를 찾을 수 없습니다.');
      }

      // 2. 상대방(수신자) 정보 조회
      const recipient = await tx.user.findUnique({
        where: { mb_id: player2_id }, // 상대방의 mb_id
        select: { id: true, name: true },
      });

      if (!recipient) {
        throw new Error('수신자 정보를 찾을 수 없습니다.');
      }

      // 3. bi_match 테이블에 매치 생성
      const match = await tx.bi_match.create({
        data: {
          player1_id: player1_id,
          player2_id: player2_id,
          preferred_date: new Date(preferred_date).toISOString(),
          game_type: game_type || null,
          location: location || null,
          match_status: 'PENDING',
        },
      });

      // 4. bi_match_request 테이블에 요청 생성
      const matchRequest = await tx.bi_match_request.create({
        data: {
          match_id: match.match_id,
          requester_id: player1_id,
          recipient_id: player2_id,
          request_status: 'PENDING',
          request_date: new Date(),
          preferred_date: new Date(preferred_date).toISOString(),
          message: message || null,
          game_type: game_type || null,
          location: location || null,
          is_notified: true, // 알림을 생성하므로 true로 설정
        },
      });

      // 5. 알림 메시지 생성
      const requesterName = requester.name || '알 수 없음';
      const recipientName = recipient.name || '알 수 없음음';
      const title = `새로운 매치 신청이 도착했습니다`;
      const alertMessage = message
        ? `${requesterName}님이 매치를 신청했습니다: "${message}"`
        : `${requesterName}님이 매치를 신청했습니다.`;

      // 게임 타입이 있는 경우 추가 정보
      const gameTypeText = game_type
        ? game_type === 'FOUR_BALL'
          ? '4구'
          : game_type === 'THREE_CUSHION'
            ? '3쿠션'
            : game_type
        : '';

      const fullAlertMessage = gameTypeText
        ? `${alertMessage} [${gameTypeText}]`
        : alertMessage;

      // 6. 알림 저장

      // 상대방 알람
      const alert = await tx.bi_alert.create({
        data: {
          user_id: recipient.id,
          title,
          message: fullAlertMessage,
          type: 'match_request',
          status: 'unread',
        },
      });

      // 본인알람
      const requesterAlert = await tx.bi_alert.create({
        data: {
          user_id: requester.id, // 신청자 ID
          title: '매치 신청이 완료되었습니다',
          message: `${recipientName}님에게 매치 신청을 보냈습니다. 수락을 기다리는 중입니다.`,
          type: 'match_sent',
          category: '매칭',
          status: 'unread',
        },
      });

      // 7-1. 상대방(수신자) 알림 로그 생성
      const recipientAlertLog = await tx.bi_alert_log.create({
        data: {
          event_type: 'match_request',
          description: `매치 신청 알림: ${player1_id} -> ${player2_id}`,
          user_id: recipient.id, // 수신자 ID
          additional_data: {
            matchId: match.match_id,
            requestId: matchRequest.request_id,
            requesterName: requesterName,
            gameType: game_type,
            location: location,
            preferredDate: preferred_date,
          },
        },
      });

      // 7-2. 본인(신청자) 알림 로그 생성
      const requesterAlertLog = await tx.bi_alert_log.create({
        data: {
          event_type: 'match_sent', // 이벤트 타입 다르게 설정
          description: `매치 신청 완료: ${player1_id} -> ${player2_id}`,
          user_id: requester.id, // 신청자 ID
          additional_data: {
            matchId: match.match_id,
            requestId: matchRequest.request_id,
            recipientName: recipientName,
            gameType: game_type,
            location: location,
            preferredDate: preferred_date,
          },
        },
      });

      return {
        match,
        matchRequest,
        alert,
        requesterAlert,
        recipientAlertLog,
        requesterAlertLog,
        requesterName,
      };
    });

    return NextResponse.json({
      success: true,
      message: `${result.requesterName}님의 매치 신청이 성공적으로 처리되었습니다.`,
      data: {
        match_id: result.match.match_id,
        request_id: result.matchRequest.request_id,
      },
    });
  } catch (error) {
    console.error('매칭 신청 오류:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : '매칭 신청 중 오류가 발생했습니다.';

    return NextResponse.json(
      { error: errorMessage },
      {
        status:
          error instanceof Error && error.message.includes('찾을 수 없습니다')
            ? 404
            : 500,
      }
    );
  }
}
