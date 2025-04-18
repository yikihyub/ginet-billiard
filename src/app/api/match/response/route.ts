import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { matchId, response, userId } = await request.json();

    if (!matchId || !response || !userId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 매치 정보 조회
    const match = await prisma.bi_match.findUnique({
      where: { match_id: matchId },
      select: {
        match_id: true,
        match_uid: true, // ✅ 추가
        player1_id: true,
        player2_id: true,
        game_type: true,
        preferred_date: true,
        match_status: true,
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: '매치를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 권한 확인 (요청받은 사용자만 응답 가능)
    if (match.player2_id !== userId) {
      return NextResponse.json(
        { error: '이 매치에 대한 응답 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 권한 확인 (요청받은 사용자만 응답 가능)
    if (match.match_status !== 'PENDING') {
      return NextResponse.json(
        { error: '이미 다른 회원과 경기 일정이 잡혔습니다.' },
        { status: 402 }
      );
    }

    // 트랜잭션으로 여러 테이블을 함께 업데이트
    const result = await prisma.$transaction(async (tx: any) => {
      const alreadyAccepted = await tx.bi_match.findFirst({
        where: {
          player1_id: match.player1_id,
          match_status: 'ACCEPTED',
        },
      });

      // 2. 이미 다른 매치가 ACCEPTED 상태면 → 지금 요청된 매치를 CANCEL 처리
      if (alreadyAccepted) {
        const cancelledMatch = await tx.bi_match.update({
          where: { match_id: matchId },
          data: {
            match_status: 'CANCELLED',
            request_status: 'CANCELLED',
            response_date: new Date(),
            cancel_reason: '다른 회원과 매치가 이미 성사되었습니다.',
            cancelled_by: userId,
          },
        });

      return {
          status: 'CANCELLED',
          match: cancelledMatch,
          message: '이미 다른 매치가 수락되어 자동 취소되었습니다.',
        };
      }

      // 1. bi_match 테이블 업데이트
      const updatedMatch = await tx.bi_match.update({
        where: {
          match_id: matchId,
          match_status: 'PENDING',
        },
        data: {
          match_status: 'ACCEPTED',
          request_status: 'ACCEPTED',
          response_date: new Date(),
        },
      });

      // 2. 매치 참가자 등록 (player1 - 요청자)
      await tx.bi_match_participant.create({
        data: {
          match_id: matchId,
          user_id: match.player1_id,
          team: 1,
        },
      });

      // 3. 매치 참가자 등록 (player2 - 수락자)
      await tx.bi_match_participant.create({
        data: {
          match_id: matchId,
          user_id: match.player2_id,
          team: 2,
        },
      });

     // 매치가 수락된 경우에만 채팅방 생성
      let chatRoom: {
        id: string;
        name: string;
        group_id: string;
        created_at: Date;
        updated_at: Date;
      } | null = null;
      if (response === 'ACCEPTED') {
        // 2. 채팅방 생성
        const player1 = await tx.user.findUnique({
          where: { mb_id: match.player1_id },
          select: { name: true },
        });

        const player2 = await tx.user.findUnique({
          where: { mb_id: match.player2_id },
          select: { name: true },
        });

        // 채팅방 이름 생성 (두 사용자 이름 조합)
        const roomName = `${player1?.name || '사용자'} & ${player2?.name || '사용자'} 매치 채팅`;

        // 채팅방 생성
        chatRoom = await tx.bi_chat_room.create({
          data: {
            id: randomUUID(),
            name: roomName,
            group_id: `group-${match.match_uid}`,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        // 3. 채팅방 참가자 추가 (player1)
        await tx.bi_chat_room_participants.create({
          data: {
            chat_room_id: match.match_uid,
            user_id: match.player1_id,
            is_admin: false,
          },
        });

        // 4. 채팅방 참가자 추가 (player2)
        await tx.bi_chat_room_participants.create({
          data: {
            chat_room_id: match.match_uid,
            user_id: match.player2_id,
            is_admin: false,
          },
        });
      }

      if (updatedMatch.count === 0) {
        throw new Error('이 매치는 이미 처리되었습니다.');
      }

      // 2. 요청자의 user.id 조회
      const requester = await tx.user.findUnique({
        where: { mb_id: match.player1_id || '' },
        select: { id: true, name: true },
      });

      if (!requester) {
        throw new Error('요청자 정보를 찾을 수 없습니다.');
      }

      // 3. 알림 생성 (요청자에게)
      const alert = await tx.bi_alert.create({
        data: {
          user_id: requester.id,
          title: response === 'ACCEPT' ? '매치 수락됨' : '매치 거절됨',
          message:
            response === 'ACCEPT'
              ? `${userId}님이 매치 요청을 수락했습니다.`
              : `${userId}님이 매치 요청을 거절했습니다.`,
          type: response === 'ACCEPT' ? 'MATCH_ACCEPTED' : 'MATCH_REJECTED',
          status: 'unread',
          category: 'match',
          data: {
            matchId: matchId,
            matchUid: match.match_uid,
            gameType: match.game_type,
            opponentId: userId,
            chatRoomId: chatRoom?.id, // 채팅방 ID도 포함
          },
        },
      });

      return { match: updatedMatch, alert, chatRoom };
    });

    return NextResponse.json(result.match);
  } catch (error) {
    console.error('매치 응답 처리 오류:', error);
    return NextResponse.json(
      { error: '매치 응답 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
