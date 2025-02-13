'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function GameTypeSelect() {
  return (
    <Select>
      <SelectTrigger className="h-[52px] w-full">
        <SelectValue placeholder="게임 유형 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3구">3구</SelectItem>
        <SelectItem value="4구">4구</SelectItem>
        <SelectItem value="포켓볼">포켓볼</SelectItem>
        <SelectItem value="상관없음">상관없음</SelectItem>
      </SelectContent>
    </Select>
  );
}
