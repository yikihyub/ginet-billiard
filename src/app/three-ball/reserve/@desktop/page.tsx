import React from "react";

import { SearchBar } from "./_components/search/search-bar";
import { BilliardRoomCard } from "./_components/card/billiard-roomcard";

import "../../threeBall.css";

export default function DesktopPage() {
  return (
    <>
      <aside className="leftsidebar h-full md:w-[400px] w-full">
        <div className="flex flex-col w-full h-full gap-2">
          <SearchBar />
          <div className="border border-[#eee]"></div>
          <BilliardRoomCard />
          <div className="border border-[#eee]"></div>
          <BilliardRoomCard />
          <div className="border border-[#eee]"></div>
          <BilliardRoomCard />
          <div className="border border-[#eee]"></div>
          <BilliardRoomCard />
        </div>
      </aside>
    </>
  );
}
