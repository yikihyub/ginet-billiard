import React from "react";

import MainBanner from "../_components/banner/main-banner";
import { BilliardGroup } from "./_components/group/billiard-group";
import FilterSection from "./_components/filter-section/filter-section";

export default function BilliardGroupsPage() {
  const groups = [
    {
      title: "신규 환영! 당구 초보자 친목 모임",
      location: "서울 강서구",
      timeToMeet: "2시간 전 대화",
      currentMembers: 3,
      maxMembers: 6,
    },
    {
      title: "주말 3구 실력자 당구대회 준비",
      location: "서울 종로구",
      timeToMeet: "1시간 30분 전 대화",
      currentMembers: 5,
      maxMembers: 8,
    },
    {
      title: "당구 입문자를 위한 실력 키우기 모임",
      location: "서울 마포구",
      timeToMeet: "40분 전 대화",
      currentMembers: 2,
      maxMembers: 4,
    },
    {
      title: "프로모션 이벤트! 평일 저녁 당구 모임",
      location: "서울 중구",
      timeToMeet: "20분 전 대화",
      currentMembers: 7,
      maxMembers: 10,
    },
    {
      title: "주말 한정! 친목 & 실력 향상 모임",
      location: "서울 강동구",
      timeToMeet: "3시간 전 대화",
      currentMembers: 6,
      maxMembers: 9,
    },
    {
      title: "당구 매니아 모임 - 4구 고수만 모여라",
      location: "서울 노원구",
      timeToMeet: "15분 전 대화",
      currentMembers: 8,
      maxMembers: 12,
    },
    {
      title: "초보자부터 실력자까지 함께하는 친목 모임",
      location: "서울 서초구",
      timeToMeet: "50분 전 대화",
      currentMembers: 4,
      maxMembers: 8,
    },
    {
      title: "화요일 밤 3구 실력 향상 클럽",
      location: "서울 관악구",
      timeToMeet: "1시간 전 대화",
      currentMembers: 5,
      maxMembers: 7,
    },
    {
      title: "초보자부터 실력자까지 함께하는 친목 모임",
      location: "서울 서초구",
      timeToMeet: "50분 전 대화",
      currentMembers: 4,
      maxMembers: 8,
    },
    {
      title: "화요일 밤 3구 실력 향상 클럽",
      location: "서울 관악구",
      timeToMeet: "1시간 전 대화",
      currentMembers: 5,
      maxMembers: 7,
    },
  ];

  return (
    <div className="p-4">
      <MainBanner />
      <FilterSection />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group, index) => (
          <BilliardGroup key={index} {...group} />
        ))}
      </div>
    </div>
  );
}
