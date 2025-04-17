'use client';

import { Search, X, Calendar, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FilterContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  gameTypeFilter: string;
  setGameTypeFilter: (type: string) => void;
}

export default function FilterContent({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  gameTypeFilter,
  setGameTypeFilter,
}: FilterContentProps) {
  return (
    <div className="space-y-4 p-4">
      {/* 검색 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">상대방 검색</span>
        </div>
        <div className="relative">
          <Input
            placeholder="상대방 이름 검색"
            className="w-full pl-8 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <X
              className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">날짜</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="flex-1 text-sm"
          />
          {dateFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDateFilter('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 게임타입 필터 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">게임 타입</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <Button
            variant={gameTypeFilter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGameTypeFilter('ALL')}
            className={
              gameTypeFilter === 'ALL' ? 'bg-green-500 hover:bg-green-600' : ''
            }
          >
            전체
          </Button>
          <Button
            variant={gameTypeFilter === 'THREE_BALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGameTypeFilter('THREE_BALL')}
            className={
              gameTypeFilter === 'THREE_BALL'
                ? 'bg-green-500 hover:bg-green-600'
                : ''
            }
          >
            3구
          </Button>
          <Button
            variant={gameTypeFilter === 'FOUR_BALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGameTypeFilter('FOUR_BALL')}
            className={
              gameTypeFilter === 'FOUR_BALL'
                ? 'bg-green-500 hover:bg-green-600'
                : ''
            }
          >
            4구
          </Button>
        </div>
      </div>
    </div>
  );
}
