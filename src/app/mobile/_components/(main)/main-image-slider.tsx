'use client';

import React from 'react';
import Image from 'next/image';
// Swiper 관련 import
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
// Swiper 스타일
import 'swiper/css';
import 'swiper/css/pagination';

interface SlideItem {
  id: number;
  image: string;
}

export default function JobPlanetSlider(): React.ReactElement {
  const slides: SlideItem[] = [
    {
      id: 1,
      image: '/ad/adver1.png',
    },
    {
      id: 2,
      image: '/ad/adver2.png',
    },
    {
      id: 3,
      image: '/ad/adver3.png',
    },
  ];

  const paginationOptions: SwiperOptions['pagination'] = {
    type: 'fraction',
    el: '.swiper-pagination',
    formatFractionCurrent: (number: number) => number,
    formatFractionTotal: (number: number) => number,
    renderFraction: (currentClass: string, totalClass: string) => {
      return (
        `<span class="${currentClass}"></span>` +
        '<span class="mx-1">/</span>' +
        `<span class="${totalClass}"></span>`
      );
    },
  };

  return (
    <div className="mx-auto overflow-visible pl-[24px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={paginationOptions}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        slidesPerView={1.06} // ✅ 여기 추가
        spaceBetween={15} // ✅ 여기 추가
        centeredSlides={false} // ✅ 선택 사항
        className="overflow-visible"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={slide.image}
                alt={`Slide ${slide.id}`}
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 하단 인디케이터 스타일 커스텀 */}
      <style jsx global>{`
        .swiper-pagination {
          font-size: 12px;
          position: absolute;
          text-align: left;
          bottom: 8px;
          left: 24px;
          width: auto !important;
          color: white;
        }
      `}</style>
    </div>
  );
}
