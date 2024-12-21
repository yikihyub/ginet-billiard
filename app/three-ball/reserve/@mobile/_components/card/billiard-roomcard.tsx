"use client";

import { BilliardRoomInfo } from "./billiard-roominfo";
import { BilliardRoomImage } from "./billiard-roomimage";

export function BilliardRoomCard() {
  return (
    <div className="flex w-full">
      <BilliardRoomImage />
      <BilliardRoomInfo id="billiard-123" />
    </div>
  );
}
