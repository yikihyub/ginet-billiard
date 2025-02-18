'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';

interface FilterSectionProps {
  maxDistance: number;
  onMaxDistanceChange: (value: number) => void;
}

export default function FilterSection({
  maxDistance,
  onMaxDistanceChange,
}: FilterSectionProps) {
  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          검색 반경: {maxDistance}km
        </label>
        <Slider
          value={[maxDistance]}
          onValueChange={(value) => onMaxDistanceChange(value[0])}
          min={1}
          max={50}
          step={1}
        />
      </div>
      {/* 추가 필터 옵션들을 여기에 구현할 수 있습니다 */}
    </div>
  );
}
