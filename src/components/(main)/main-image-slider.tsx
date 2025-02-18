'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export default function MainImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [
    { id: 1, image: '/logo/billard_web_banner.png' },
    { id: 2, image: '/logo/billard_web_banner1.jpg' },
    { id: 3, image: '/logo/billard_web_banner2.jpg' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="relative h-[240px] overflow-hidden rounded-2xl sm:h-[480px]">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="absolute h-full w-full transition-transform duration-500"
            style={{
              transform: `translateX(${(idx - currentIndex) * 100}%)`,
            }}
          >
            <Image
              src={item.image}
              alt={`Slide ${item.id}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}

        {/* Previous and Next Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
        >
          →
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                currentIndex === idx ? 'bg-black' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
