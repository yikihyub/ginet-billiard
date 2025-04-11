'use client';

import React from 'react';

import FilterButton from '../filter/filter-button';
import { Checkbox } from '@/components/ui/checkbox';

import { RefreshCcw } from 'lucide-react';
import { SearchBarProps } from '../../../_types';

export function SearchBar({ onRefresh }: SearchBarProps) {
  return (
    <div className="flex items-center justify-between">
      {/* <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="매치 검색..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div> */}
      <div className="flex gap-2">
        <div>
          <Checkbox className="h-4 w-4" />
        </div>
        <div className="text-sm font-semibold">신청 가능한 매치만 보기</div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <FilterButton />
        </div>
        <div className="flex items-center gap-1" onClick={onRefresh}>
          <div>
            <RefreshCcw className="h-3 w-3" />
          </div>
          <div className="text-sm font-semibold">새로고침</div>
        </div>
      </div>
    </div>
  );
}
