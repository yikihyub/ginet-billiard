'use client';

import React, { useEffect, useState } from 'react';

import { ChevronRight } from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';

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
    <section className="m-auto max-w-[1024px] py-6 pl-4 pr-0 md:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between pr-4">
        <div className="text-md font-bold">인기 동호회</div>
        <Link href="/club/search" className="text-xs text-gray-400">
          <div className="flex items-center">
            전체 보기 <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <div className="no-scrollbar overflow-x-auto">
        <div className="flex min-w-max space-x-4">
          {clubs.map((club) => (
            <div key={club.id} className="w-64">
              {/* 이미지 */}
              <div className="h-32 rounded-lg">
                <div className="relative flex h-32 flex-col items-center justify-center rounded-lg">
                  <Image
                    src="/logo/billard_web_banner.png"
                    alt="club_banner"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>

              <div className="p-1">
                <h3 className="mb-1 text-sm font-semibold">
                  &#91;{club.type}&#93; {club.title}
                </h3>
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
