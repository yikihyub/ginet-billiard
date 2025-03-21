"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GameTypeSelect() {
  return (
    <Select defaultValue="상관없음">
      <SelectTrigger className="w-full text-md h-12 shadow-none">
        <SelectValue placeholder="게임 종류를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3구" className="text-lg">
          3구
        </SelectItem>
        <SelectItem value="4구" className="text-lg">
          4구
        </SelectItem>
        <SelectItem value="포켓볼" className="text-lg">
          포켓볼
        </SelectItem>
        <SelectItem value="상관없음" className="text-lg">
          상관없음
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
