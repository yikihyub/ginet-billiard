// app/mypage/_components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isMainPage = pathname === "/mypage";

  if (isMobile && !isMainPage) {
    return null;
  }

  const menuGroups = [
    {
      title: "당구장",
      items: [
        { name: "최근 이용한 당구장", path: "/mypage/latest-billiard" },
        { name: "즐겨찾는 당구장", path: "/mypage/favorite-billiard" },
      ],
    },
    // {
    //   title: "레슨",
    //   items: [
    //     { name: "레슨 상담", path: "/mypage/lesson" },
    //     { name: "최근 레슨 내역", path: "/mypage/latest-lesson" },
    //     { name: "즐겨 찾는 레슨", path: "/mypage/favorite-lesson" },
    //     { name: "레슨 프로 목록", path: "/mypage/inventory" },
    //   ],
    // },
    {
      title: "기록",
      items: [
        { name: "4구 기록", path: "/mypage/four-ball" },
        { name: "3구 기록", path: "/mypage/three-ball" },
        { name: "포켓볼 기록", path: "/mypage/pocketball" },
      ],
    },
    // {
    //   title: "결제",
    //   items: [{ name: "결제수단", path: "/mypage/@desktop/payment" }],
    // },
    {
      title: "이벤트",
      items: [
        { name: "친구 초대하기", path: "/mypage/invite" },
        { name: "매장 정보 제보하기", path: "/mypage/shop-info" },
        { name: "이벤트 모아보기", path: "/mypage/event" },
      ],
    },
    {
      title: "고객센터 및 설정",
      items: [
        { name: "1:1 문의", path: "/mypage/require" },
        { name: "공지사항", path: "/mypage/notice" },
        { name: "자주묻는 질문", path: "/mypage/faq" },
        { name: "알림설정", path: "/mypage/notice-set" },
        { name: "차단 친구 관리", path: "/mypage/block-set" },
      ],
    },
  ];

  return (
    <nav className={`${isMobile ? "w-full" : "w-[280px]"} p-6`}>
      {menuGroups.map((group, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">
            {group.title}
          </h2>
          {group.items.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block p-3 rounded-lg font-semibold ${
                pathname === item.path ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      ))}
      <Button
        onClick={() => signOut({ callbackUrl: "/" })} // 로그아웃 후 메인 페이지로 리다이렉트
        variant="ghost"
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </Button>
    </nav>
  );
}
