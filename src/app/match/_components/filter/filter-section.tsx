'use client';

import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function FilterSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');

  return (
    <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <Input
          placeholder="이름 또는 지역으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          필터
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant={selectedGame === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedGame('all')}
        >
          전체
        </Button>
        <Button
          variant={selectedGame === '4ball' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedGame('4ball')}
        >
          4구
        </Button>
        <Button
          variant={selectedGame === '3ball' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedGame('3ball')}
        >
          3구
        </Button>
      </div>
    </div>
  );
}
