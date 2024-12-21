"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ClubTab = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "동호회 찾기", path: "/club/search", enabled: true },
    { name: "동호회 등록", path: "/club/register", enabled: true },
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

export default ClubTab;
