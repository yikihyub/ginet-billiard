import React, { useState } from 'react';
import { MapPin, Tag } from 'lucide-react';

interface FilterSectionProps {
  onFilterChange: (filters: {
    location?: string;
    type?: string;
    query?: string;
  }) => void;
}

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ query: searchInput });
  };

  const handleLocationSelect = (location: string) => {
    const newLocation = location === '전체' ? undefined : location;
    setSelectedLocation(newLocation || null);

    // 기존 필터 값 유지 + location 업데이트
    onFilterChange({ location: newLocation, type: selectedType || undefined });
  };

  const handleTypeSelect = (type: string) => {
    const newType = type === '전체' ? undefined : type;
    setSelectedType(newType || null);

    // 기존 필터 값 유지 + type 업데이트
    onFilterChange({ location: selectedLocation || undefined, type: newType });
  };

  return (
    <div className="mb-6 space-y-4">
      {/* 검색 바 */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="동호회 검색..."
          className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-green-600 px-3 py-1 text-xs text-white"
        >
          검색
        </button>
      </form>

      {/* 지역 필터 */}
      <div className="space-y-2">
        <h3 className="flex items-center text-sm font-medium text-gray-700">
          <MapPin className="mr-1 h-4 w-4" />
          지역
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            '전체',
            '서울',
            '경기',
            '인천',
            '부산',
            '대구',
            '대전',
            '광주',
            '울산',
            '세종',
            '강원',
            '충북',
            '충남',
            '전북',
            '전남',
            '경북',
            '경남',
            '제주',
          ].map((location) => (
            <button
              key={location}
              className={`rounded-full px-3 py-1 text-xs ${
                selectedLocation === location ||
                (selectedLocation === null && location === '전체')
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-blue-100'
              }`}
              onClick={() => handleLocationSelect(location)}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* 당구 유형 필터 */}
      <div className="space-y-2">
        <h3 className="flex items-center text-sm font-medium text-gray-700">
          <Tag className="mr-1 h-4 w-4" />
          당구 유형
        </h3>
        <div className="flex flex-wrap gap-2">
          {['전체', '3구', '4구', '포켓볼', '종합'].map((type) => (
            <button
              key={type}
              className={`rounded-full px-3 py-1 text-xs ${
                selectedType === type ||
                (selectedType === null && type === '전체')
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-blue-100'
              }`}
              onClick={() => handleTypeSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
