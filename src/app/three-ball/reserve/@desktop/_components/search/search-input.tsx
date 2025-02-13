'use client';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  return (
    <div className="w-full">
      <Input className="h-[48px]" placeholder="당구장을 검색해보세요" />
    </div>
  );
}
