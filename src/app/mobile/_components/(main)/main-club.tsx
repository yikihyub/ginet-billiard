import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // ISR 방지

export default async function ClubsSection() {
  const clubs = await prisma.club.findMany({
    orderBy: { club_created_at: 'desc' },
    take: 10,
    select: {
      club_id: true,
      club_name: true,
      club_description: true,
      club_now_members: true,
      club_max_members: true,
      club_type: true,
      club_created_at: true,
    },
  });

  return (
    <section className="m-auto max-w-[1024px] py-4 pl-4">
      <div className="mb-4 flex items-center justify-between pr-4">
        <div className="text-md font-bold">인기 동호회</div>
        <Link href="/mobile/club/search" className="text-xs text-gray-400">
          <div className="flex items-center">
            전체 보기 <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <div className="no-scrollbar overflow-x-auto">
        <div className="flex min-w-max space-x-4">
          {clubs.map((club) => (
            <div key={club.club_id} className="w-46">
              <div className="overflow-hidden rounded-lg">
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src="/logo/billard_web_banner.png"
                    alt="club_banner"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="p-1">
                <h3 className="text-sm font-semibold">
                  &#91;{club.club_type}&#93; {club.club_name}
                </h3>

                <div className="mb-1 flex flex-col text-xs text-gray-500">
                  <div>
                    멤버 {club.club_now_members} / {club.club_max_members}명
                  </div>
                  <div className="line-clamp-2">{club.club_description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
