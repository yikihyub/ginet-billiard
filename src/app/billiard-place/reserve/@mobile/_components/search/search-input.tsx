'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

import { useSearch } from '../../../_components/provider/search-provider';

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
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-5 w-5" />
      </div>
      <Input
        placeholder="당구장을 검색해보세요"
        className="text-md h-12 rounded-md border-none bg-gray-100 pl-10 shadow-none transition-colors duration-200 hover:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
