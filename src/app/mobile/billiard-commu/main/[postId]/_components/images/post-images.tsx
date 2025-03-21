'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PostImage {
  id: number;
  post_id: number;
  image_url: string;
}

interface PostImagesProps {
  images: PostImage[];
}

export default function PostImages({ images }: PostImagesProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative mb-4">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={images[activeImageIndex]?.image_url || '/logo/billiard-ball.png'}
          alt={`포스트 이미지 ${activeImageIndex + 1}`}
          fill
          className="object-contain"
        />
      </div>

      {/* 이미지 페이지네이션 표시기 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`h-2 w-2 rounded-full ${
                index === activeImageIndex ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
