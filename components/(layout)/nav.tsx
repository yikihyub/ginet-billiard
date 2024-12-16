import React from "react";
import { User, Search, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MenuToggle from "./menu-toggle";

export default function Nav() {
  return (
    <nav className="bg-white text-black">
      <div className="container mx-auto max-w-screen-lg px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" aria-label="Home">
            <Image
              src="/logo/logo.png"
              alt="Website Logo"
              width={40}
              height={20}
              priority={true}
              className="h-auto w-auto"
            />
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/reservation" className="hover:underline">
              <Search />
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              <CalendarDays />
            </Link>
          </li>
          <li>
            <Link href="/mypage" className="hover:underline">
              <User />
            </Link>
          </li>
          <li>
            <MenuToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
