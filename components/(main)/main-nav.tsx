"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname(); // useSearchParams 대신 usePathname 사용

  const navItems = [
    { name: "개인전", path: "/", enabled: true },
    { name: "팀전", path: "/team", enabled: true },
    { name: "당구장예약", path: "/reservation", enabled: true },
  ];

  return (
    <div className="max-w-1024px m-auto p-4">
      <div className="flex items-center justify-start gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`text-md transition-colors ${
              pathname === item.path
                ? "font-bold text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
