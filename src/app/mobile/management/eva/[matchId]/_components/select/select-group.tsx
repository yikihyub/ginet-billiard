'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import SelectButton from '../button/select-button';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectGroupProps {
  title: string;
  options: SelectOption[];
  selectedValue: string | null;
  onChange: (value: any) => void;
}

export default function SelectGroup({
  title,
  options,
  selectedValue,
  onChange,
}: SelectGroupProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold">{title}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <SelectButton
            key={option.value}
            label={option.label}
            selected={selectedValue === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
