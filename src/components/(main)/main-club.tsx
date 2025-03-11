'use client';

import React, { useEffect, useState } from 'react';

import { ImageOff } from 'lucide-react';

import Link from 'next/link';

interface Club {
  id: string;
  title: string;
  location: string;
  description: string;
  currentMembers: number;
  maxMembers: number;
  tags: string[];
  created: string;
  type: string;
}

const ClubsSection = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('/api/club/getclub');
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return <div className="py-6 text-center">동호회 정보를 불러오는 중...</div>;
  }

  return (
    <section className="m-auto max-w-[1024px] bg-gray-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">인기 동호회</h2>
        <Link href="/clubs" className="text-sm text-blue-600 hover:underline">
          더보기
        </Link>
      </div>

      <div className="no-scrollbar overflow-x-auto pb-4">
        <div className="flex min-w-max space-x-4">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="w-64 flex-none rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative h-32 overflow-hidden rounded-t-lg">
                {/* <Image
                  src={`/api${club.image}`}
                  alt={club.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                /> */}
                {/* <ImageOff className="h-12 w-12 text-gray-500" /> */}
                <label className="w-full cursor-pointer">
                  <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <ImageOff className="h-12 w-12 text-gray-500" />
                      <p className="pt-1 text-sm text-gray-500">
                        등록된 사진이 없습니다.
                      </p>
                    </div>
                  </div>
                </label>
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 px-2 py-1 text-xs text-white">
                  {club.type}
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 text-base font-medium">{club.title}</h3>
                <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                  {club.description}
                </p>
                <div className="text-xs text-gray-500">
                  멤버 {club.currentMembers} / {club.maxMembers}명
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubsSection;
