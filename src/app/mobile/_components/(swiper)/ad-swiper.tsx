'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    image: '/ad/광고베너2.png',
    title: '프리미엄 샤시 전문 기업',
    description:
      '튼튼하고 완벽한 단열! 고품질 샤시를 합리적인 가격에 제공합니다.',
  },
  {
    id: 2,
    image: '/ad/광고베너3.png',
    title: '당구 장비의 모든 것!',
    description: '프로부터 초보까지! 최고급 당구 용품을 한곳에서 만나보세요.',
  },
];

export default function SwiperComponent() {
  return (
    <div className="mx-auto w-full p-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative flex h-24 items-center gap-4 rounded-md bg-gray-50 p-4">
              <Image
                src={slide.image}
                alt={slide.title}
                className="rounded-md object-cover"
                objectFit="cover"
                layout="fill"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
