import React from 'react';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { prisma } from '@/lib/prisma';
import { calculateDistance } from '@/lib/utils';

import MainBanner from '../_components/banner/main-banner';
import FilterSection from './_components/filter/filter-section';

import { MatchUser, MemberSearchPageProps } from '@/types/(match)';
import UserCard from './_components/card/user-card';

type GameType = 'THREE_BALL' | 'FOUR_BALL';

export default async function MemberSearchPage({
  searchParams,
}: MemberSearchPageProps) {
  const session = await getServerSession(authOptions);
  const params = await Promise.resolve(searchParams);

  // 세션이 없는 경우 처리
  if (!session || !session.user || !session.user.mb_id) {
    return (
      <div className="mt-4 p-6 text-center text-gray-500">
        로그인이 필요합니다. 로그인 후 이용해주세요.
      </div>
    );
  }

  const userId = session?.user.mb_id;
  const maxDistance = params?.distance ? Number(params.distance) : 20;
  const rawGameType = params?.type || '전체';

  // 문자열 → enum 매핑 (포켓볼 추가)
  const gameTypeMap: Record<string, GameType | null> = {
    전체: null,
    '3구': 'THREE_BALL',
    '4구': 'FOUR_BALL',
  };

  const mappedGameType = gameTypeMap[rawGameType] ?? null;

  // 현재 유저의 위치 정보 가져오기
  const currentUser = await prisma.user.findUnique({
    where: { mb_id: userId! },
    select: {
      latitude: true,
      longitude: true,
    },
  });

  // 위치 정보가 없는 경우 처리
  if (!currentUser?.latitude || !currentUser?.longitude) {
    return (
      <div className="mt-4 p-6 text-center text-gray-500">
        위치 정보가 없습니다. 위치 설정을 먼저 해주세요.
      </div>
    );
  }

  // 현재 사용자가 차단한 사용자 ID 목록 조회
  const blockedByMe = await prisma.bi_user_block.findMany({
    where: {
      blocker_id: userId,
      is_active: true,
    },
    select: {
      blocked_id: true,
    },
  });

  // 현재 사용자를 차단한 사용자 ID 목록 조회
  const blockedMe = await prisma.bi_user_block.findMany({
    where: {
      blocked_id: userId,
      is_active: true,
    },
    select: {
      blocker_id: true,
    },
  });

  // 차단 관계에 있는 모든 사용자 ID 배열 생성
  const blockedUserIds = [
    ...blockedByMe.map((block) => block.blocked_id),
    ...blockedMe.map((block) => block.blocker_id),
  ];

  // 다른 모든 유저 조회 (차단 관계가 없는 사용자만)
  const allUsers = await prisma.user.findMany({
    where: {
      mb_id: {
        not: userId, // 본인 제외
        notIn: blockedUserIds, // 차단 관계 제외
      },
      // 게임 타입 필터 (null이 아닌 경우에만)
      ...(mappedGameType && { preferGame: mappedGameType }),
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
      preferGame: true,
      profile_image: true,
    },
  });

  // 거리 계산 및 필터링 + 타입 변환
  const usersWithDistance = allUsers
    .map((user) => {
      // 위치 정보가 없는 사용자는 제외
      if (!user.latitude || !user.longitude) {
        return {
          ...user,
          distance: Infinity,
          // MatchUser 타입에 필요한 값들 추가 및 변환
          profileImage: user.profile_image || '/default-profile.png', // DB 필드명과 타입 필드명이 다르면 매핑
          preferredTime: user.preferred_time || [], // 매핑
        };
      }

      return {
        ...user,
        distance: calculateDistance(
          Number(currentUser.latitude),
          Number(currentUser.longitude),
          user.latitude,
          user.longitude
        ),
        // MatchUser 타입에 필요한 값들 추가 및 변환
        profileImage: user.profile_image || '/default-profile.png',
        preferredTime: user.preferred_time || [],
      };
    })
    .filter((user) => user.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);

  // 검색 결과가 없는 경우 처리
  if (usersWithDistance.length === 0) {
    return (
      <div className="mt-4 p-6 text-center text-gray-500">
        해당 조건에 맞는 회원이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white px-4 py-2">
        <MainBanner />
      </div>

      <div className="bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold">회원</div>
          <FilterSection />
        </div>

        <div className="text-sm text-gray-500">
          총 {usersWithDistance.length}명의 회원을 찾았습니다
        </div>
        <ul className="mt-2 divide-y divide-gray-200">
          {usersWithDistance.map((user) => (
            <UserCard key={user.id} user={user as unknown as MatchUser} />
          ))}
        </ul>
      </div>
    </div>
  );
}
