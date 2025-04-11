// components/select/category-section.tsx
'use client';

import React from 'react';
import { Label } from '@/components/ui/label';

import CategoryOptionButton from '../button/category-option-button';

type CategoryData = {
  title: string;
  selected: string | null;
  options: string[];
};

type Props = {
  categories: { [key: string]: CategoryData };
  onSelect: (category: string, option: string) => void;
};

export default function CategorySection({ categories, onSelect }: Props) {
  return (
    <div className="mb-6">
      {Object.keys(categories).map((category) => (
        <div key={category} className="mb-6 space-y-2">
          <Label className="text-sm font-bold">
            {categories[category].title}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {categories[category].options.map((option, index) => (
              <CategoryOptionButton
                key={index}
                icon=""
                label={option}
                selected={categories[category].selected === option}
                onClick={() => onSelect(category, option)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
