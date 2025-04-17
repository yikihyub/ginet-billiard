'use client';

import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import FilterContent from './match-content';

interface MatchTabsWithFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  gameTypeFilter: string;
  setGameTypeFilter: (type: string) => void;
  handleClearFilters: () => void;
}

export default function MatchTabsWithFilters({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  gameTypeFilter,
  setGameTypeFilter,
  handleClearFilters,
}: MatchTabsWithFiltersProps) {
  const hasActiveFilters = searchTerm || dateFilter || gameTypeFilter !== 'ALL';

  return (
    <div className="flex items-center gap-2 overflow-x-auto bg-white px-4 pt-3">
      {/* 탭 버튼들 */}
      <div className="flex flex-1 gap-2 text-sm font-semibold">
        {[
          { key: 'ACCEPTED', label: '예정 경기' },
          { key: 'IN_PROGRESS', label: '진행 경기' },
          { key: 'COMPLETED', label: '완료 경기' },
        ].map(({ key, label }) => (
          <Badge
            key={key}
            variant="outline"
            className={`cursor-pointer px-3 py-1.5 ${
              activeTab === key
                ? 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </Badge>
        ))}
      </div>

      {/* 필터 드로어 버튼 */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`ml-auto flex items-center gap-1 ${
              hasActiveFilters ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            <Filter className="h-4 w-4" />
            필터
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-green-500 px-1.5 py-0.5 text-xs text-white">
                •
              </span>
            )}
          </Button>
        </DrawerTrigger>

        <DrawerContent className="p-4">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>검색 및 필터</DrawerTitle>
            </DrawerHeader>

            <FilterContent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              gameTypeFilter={gameTypeFilter}
              setGameTypeFilter={setGameTypeFilter}
            />

            <DrawerFooter>
              <Button variant="default" className="w-full">
                적용하기
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClearFilters}
              >
                필터 초기화
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
