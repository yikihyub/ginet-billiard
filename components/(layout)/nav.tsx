import React from "react";
import { User, Search, CalendarDays } from "lucide-react";
import Image from "next/image";
import MenuToggle from "./menu-toggle";

export default function Nav() {
  return (
    <nav className="bg-white text-black">
      <div className="container mx-auto max-w-screen-lg px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a href="/" aria-label="Home">
            <Image
              src="/logo/logo.png"
              alt="Website Logo"
              width={40}
              height={20}
              priority={true}
              className="h-auto w-auto"
            />
          </a>
        </div>
        <ul className="flex space-x-4">
          <li>
            <a href="/reservation" className="hover:underline">
              <Search />
            </a>
          </li>
          <li>
            <a href="/about" className="hover:underline">
              <CalendarDays />
            </a>
          </li>
          <li>
            <a href="/mypage" className="hover:underline">
              <User />
            </a>
          </li>
          <li>
            <MenuToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
