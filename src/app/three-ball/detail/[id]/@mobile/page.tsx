import React from "react";

import ImageSlider from "./_components/image-slider";
import BasicInfo from "./_components/basic-info";
import MatchData from "./_components/match-data";
import FacilityInfo from "./_components/facility-info";
import ReserveButton from "./_components/reserve-button";
import IntroInfo from "./_components/intro-info";
import { TimeTable } from "./_components/timetable";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function MobileDetailPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);

  const daytimes = [
    {
      yoil: "월요일",
      time: "00:00 ~ 24:00",
      originalPrice: 1800,
    },
    {
      yoil: "화요일",
      time: "00:00 ~ 24:00",
      originalPrice: 1800,
    },
    {
      yoil: "수요일",
      time: "00:00 ~ 24:00",
      originalPrice: 1800,
    },
    {
      yoil: "목요일",
      time: "00:00 ~ 24:00",
      originalPrice: 1800,
    },
    {
      yoil: "금요일",
      time: "00:00 ~ 24:00",
      originalPrice: 1800,
    },
  ];

  const weektimes = [
    {
      yoil: "토요일",
      time: "00:00 ~ 24:00",
      originalPrice: 1800,
      discountPrice: 26500,
    },
    {
      yoil: "일요일",
      time: "00:00 ~ 24:00",
      originalPrice: 1800,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <ImageSlider />
        <BasicInfo />
        <IntroInfo />
        <TimeTable dayTimes={daytimes} weekendTimes={weektimes} />
        <FacilityInfo />
      </div>
      <ReserveButton />
    </div>
  );
}
