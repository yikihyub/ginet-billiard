import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // 요청 데이터 로깅
    const requestData = await request.json();

    const {
      userInfo,
      storeInfo,
      location,
      matching,
      selectedStores,
      agree_terms,
      agree_privacy,
      agree_location,
      agree_marketing,
      agree_marketing_privacy,
    } = requestData;

    // GameType enum 처리를 위한 매핑
    type GameTypeKey = '3구' | '4구';
    type GameTypeValue = 'THREE_BALL' | 'FOUR_BALL';

    const gameTypeMap: Record<GameTypeKey, GameTypeValue> = {
      '3구': 'THREE_BALL',
      '4구': 'FOUR_BALL',
    };

    // 사용자 생성 데이터 준비
    const userData = {
      email: userInfo.email,
      mb_id: userInfo.email,
      password: await bcrypt.hash(userInfo.password, 10),
      name: userInfo.ownerName,
      phonenum: userInfo.phoneNumber,
      preferGame:
        gameTypeMap[storeInfo.preferGame as GameTypeKey] || 'FOUR_BALL',
      user_three_ability: parseInt(storeInfo.userThreeAbility),
      user_four_ability: parseInt(storeInfo.userFourAbility),
      latitude: location.latitude,
      longitude: location.longitude,
      location: location.address,
      address: location.address,
      agree_terms,
      agree_privacy,
      agree_location,
      preferred_age_group: matching.preferredAgeGroup,
      preferred_gender: matching.preferredGender,
      preferred_skill_level: matching.preferredSkillLevel,
      play_style: matching.playStyle,
      preferred_time: matching.preferredTime,
      favorite_store_ids: selectedStores.map((store: any) => store.id),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      agree_marketing: agree_marketing || false,
      agree_marketing_privacy: agree_marketing_privacy || false,
    };

    const user = await prisma.user.create({
      data: userData,
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('회원가입 에러:', error);

    // 에러 응답 수정
    return new NextResponse(
      JSON.stringify({
        error: '회원가입 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
