'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    image: '/logo/billiard-ball.png',
    title: '최고의 유통 전문 업체!',
    description:
      '신속한 배송과 최저가 보장! 믿을 수 있는 유통 서비스로 만나보세요.',
  },
  {
    id: 2,
    image: '/logo/billiard-ball2.png',
    title: '프리미엄 샤시 전문 기업',
    description:
      '튼튼하고 완벽한 단열! 고품질 샤시를 합리적인 가격에 제공합니다.',
  },
  {
    id: 3,
    image: '/logo/billiard-ball.png',
    title: '당구 장비의 모든 것!',
    description: '프로부터 초보까지! 최고급 당구 용품을 한곳에서 만나보세요.',
  },
];

export default function SwiperComponent() {
  return (
    <div className="mx-auto w-full max-w-[1024px] pl-4 pr-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-md font-bold">{slide.title}</h3>
                <p className="text-sm text-gray-500">{slide.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
