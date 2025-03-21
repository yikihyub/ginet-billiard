'use client';

import { useState } from 'react';
// import Image from 'next/image';

import { Image as ImageIcon } from 'lucide-react';
import { GalleryTabProps } from '@/types/(club)/club';

export function GalleryTab({ gallery }: GalleryTabProps) {
  const [visibleItems, setVisibleItems] = useState(6);
  const images = gallery?.images || [];

  const loadMore = () => {
    setVisibleItems((prev) => prev + 6);
  };

  return (
    <div>
      {/* <h3 className="mb-3 font-semibold">활동 사진</h3> */}
      <div>
        <h3 className="mb-3 font-semibold">활동 사진</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="aspect-square overflow-hidden rounded-lg bg-gray-200"
            >
              <div className="flex h-full w-full items-center justify-center text-gray-500">
                <ImageIcon className="h-6 w-6" />
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700">
          더 보기
        </button>
      </div>
      {/* <div className="grid grid-cols-3 gap-2">
        {images.slice(0, visibleItems).map((item) => (
          <div
            key={item.id}
            className="aspect-square overflow-hidden rounded-lg bg-gray-200"
          >
            {item.url ? (
              <Image
                src={item.url}
                alt={item.alt || '활동 사진'}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}
          </div>
        ))}
      </div> */}
      {visibleItems < images.length && (
        <button
          onClick={loadMore}
          className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700"
        >
          더 보기
        </button>
      )}
    </div>
  );
}
