'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useSearch } from '../provider/search-provider';
import { Search } from 'lucide-react';

export function SearchInput() {
  const { setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState('');

  // 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  return (
    <div className="relative w-full">
      <div className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400">
        <Search size={20} />
      </div>
      <Input
        className="h-[48px] pl-10"
        placeholder="당구장 이름으로 검색"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
