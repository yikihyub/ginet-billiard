"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ThreeballTab = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "예약하기", path: "/three-ball/reserve", enabled: true },
    { name: "상대찾기", path: "/three-ball/match", enabled: true },
  ];

  return (
    <div className="max-w-1024px m-auto ">
      <ul className="flex border-b">
        {navItems.map((item) => (
          <li key={item.path} className="mr-1 flex-1 text-center">
            <Link
              href={item.path}
              className={`
               inline-block px-6 py-3 rounded-t-lg 
               ${
                 pathname === item.path
                   ? "bg-white text-black font-bold border-b-2 border-black"
                   : "text-gray-600 hover:text-black hover:bg-gray-50"
               }
             `}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreeballTab;
