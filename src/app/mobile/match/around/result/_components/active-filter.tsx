'use client';

import { Search, Calendar, Trophy, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActiveFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  gameTypeFilter: string;
  setGameTypeFilter: (type: string) => void;
}

export default function ActiveFilters({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  gameTypeFilter,
  setGameTypeFilter,
}: ActiveFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b bg-gray-50 px-4 py-2">
      {searchTerm && (
        <Badge className="flex items-center gap-1 bg-green-50 text-green-600">
          <Search className="h-3 w-3" />
          {searchTerm}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => setSearchTerm('')}
          />
        </Badge>
      )}
      {dateFilter && (
        <Badge className="flex items-center gap-1 bg-green-50 text-green-600">
          <Calendar className="h-3 w-3" />
          {new Date(dateFilter).toLocaleDateString()}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => setDateFilter('')}
          />
        </Badge>
      )}
      {gameTypeFilter !== 'ALL' && (
        <Badge className="flex items-center gap-1 bg-green-50 text-green-600">
          <Trophy className="h-3 w-3" />
          {gameTypeFilter === 'THREE_BALL' ? '3구' : '4구'}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => setGameTypeFilter('ALL')}
          />
        </Badge>
      )}
    </div>
  );
}
