"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  MapPin,
  BookOpen,
  Award,
  Gift,
  Settings,
  Heart,
  ClipboardList,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function Sidebar() {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "당구장",
      items: [
        {
          name: "최근 이용한 당구장",
          path: "/mypage/latest-billiard",
          icon: <>1</>,
        },
        {
          name: "즐겨찾는 당구장",
          path: "/mypage/favorite-billiard",
          icon: <>1</>,
        },
      ],
    },
    {
      title: "레슨",
      items: [
        { name: "레슨 상담", path: "/mypage/lesson", icon: <>1</> },
        { name: "최근 레슨 내역", path: "/mypage/latest-lesson", icon: <>1</> },
        {
          name: "즐겨 찾는 레슨",
          path: "/mypage/favorite-lesson",
          icon: <>1</>,
        },
        { name: "레슨 프로 목록", path: "/mypage/inventory", icon: <>1</> },
      ],
    },
    {
      title: "기록",
      items: [
        { name: "4구 기록", path: "/mypage/four-ball", icon: <>1</> },
        { name: "3구 기록", path: "/mypage/three-ball", icon: <>1</> },
        { name: "포켓볼 기록", path: "/mypage/pocketball", icon: <>1</> },
      ],
    },
    {
      title: "결제",
      items: [{ name: "결제수단", path: "/mypage/payment", icon: <>1</> }],
    },
    {
      title: "이벤트",
      items: [
        { name: "친구 초대하기", path: "/mypage/invite", icon: <>1</> },
        { name: "매장 정보 제보하기", path: "/mypage/shop-info", icon: <>1</> },
        { name: "이벤트 모아보기", path: "/mypage/event", icon: <>1</> },
      ],
    },
    {
      title: "고객센터 및 설정",
      items: [
        { name: "1:1 문의", path: "/mypage/require", icon: <>1</> },
        { name: "공지사항", path: "/mypage/notice", icon: <>1</> },
        { name: "자주묻는 질문", path: "/mypage/faq", icon: <>1</> },
        { name: "알림설정", path: "/mypage/notice-set", icon: <>1</> },
        { name: "차단 친구 관리", path: "/mypage/block-set", icon: <>1</> },
        { name: "로그아웃", path: "/mypage/logout", icon: <>1</> },
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full bg-gray-100">
      {/* 프로필 섹션 */}
      <div className="flex flex-col gap-5 p-4 bg-white">
        <div>
          <Link href="/mypage/profile">
            <div className="flex items-center">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/profile.png" alt="프로필" />
                <AvatarFallback>UI</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">지아이넷</span>
                </div>
                <div className="text-sm text-gray-500">
                  ginet-korea@gmail.com
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        </div>
        <div className="flex gap-4">
          <div className="flex-col flex-1 bg-gray-100 rounded-md p-2">
            <div className="text-gray-600 text-xs">3구</div>
            <div>20</div>
          </div>
          <div className="flex-col flex-1 bg-gray-100 rounded-md p-2">
            <div className="text-gray-600 text-xs">4구</div>
            <div>250</div>
          </div>
        </div>
      </div>

      {/* 메뉴 그룹들 */}
      {/* 당구장 */}
      <div className="p-4 bg-white mt-3">
        <h2 className="font-semibold text-sm mb-2">{menuGroups[0].title}</h2>
        <div className="text-sm space-y-2">
          {menuGroups[0].items.map((item) => (
            <MenuItem
              key={item.path}
              label={item.name}
              href={item.path}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* 레슨 */}
      <div className="p-4 bg-white mt-3">
        <h2 className="font-semibold text-sm mb-2">{menuGroups[1].title}</h2>
        <div className="text-sm space-y-2">
          {menuGroups[1].items.map((item) => (
            <MenuItem
              key={item.path}
              label={item.name}
              href={item.path}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* 기록 */}
      <div className="p-4 bg-white mt-3">
        <h2 className="font-semibold text-sm mb-2">{menuGroups[2].title}</h2>
        <div className="text-sm space-y-2">
          {menuGroups[2].items.map((item) => (
            <MenuItem
              key={item.path}
              label={item.name}
              href={item.path}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* 결제 */}
      <div className="p-4 bg-white mt-3">
        <h2 className="font-semibold text-sm mb-2">{menuGroups[3].title}</h2>
        <div className="text-sm space-y-2">
          {menuGroups[3].items.map((item) => (
            <MenuItem
              key={item.path}
              label={item.name}
              href={item.path}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* 이벤트 */}
      <div className="p-4 bg-white mt-3">
        <h2 className="font-semibold text-sm mb-2">{menuGroups[4].title}</h2>
        <div className="text-sm space-y-2">
          {menuGroups[4].items.map((item) => (
            <MenuItem
              key={item.path}
              label={item.name}
              href={item.path}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* 고객센터 및 설정 */}
      <div className="p-4 bg-white mt-3">
        <h2 className="font-semibold text-sm mb-2">{menuGroups[5].title}</h2>
        <div className="text-sm space-y-2">
          {menuGroups[5].items.map((item) => (
            <MenuItem
              key={item.path}
              label={item.name}
              href={item.path}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex flex-col items-center">
      <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function MenuItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex items-center justify-between py-3">
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{label}</span>
      </div>
      <span className="text-gray-400">›</span>
    </Link>
  );
}
