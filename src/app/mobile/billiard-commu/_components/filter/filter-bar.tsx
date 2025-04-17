'use client';
import { useRouter } from 'next/navigation';
import { filterTags } from './filter-tags';

interface FilterBarProps {
  activeFilter: string;
}

export default function FilterBar({ activeFilter }: FilterBarProps) {
  const router = useRouter();

  const handleFilterChange = (filterId: string) => {
    router.push(`/billiard-commu/main?page=1&category=all&filter=${filterId}`);
  };

  return (
    <div className="scrollbar-hide no-scrollbar flex gap-2 overflow-x-auto bg-white p-3">
      {filterTags.map((tag) => (
        <button
          key={tag.id}
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${
            activeFilter === tag.id
              ? 'bg-green-500 text-white'
              : 'border bg-white text-gray-700'
          }`}
          onClick={() => handleFilterChange(tag.id)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
