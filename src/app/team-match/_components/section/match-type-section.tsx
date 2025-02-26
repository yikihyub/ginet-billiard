'use client';

import { RadioGroup } from '@/components/ui/radio-group';
import OptionCard from '../optioncard/option-card';
import { accountOptions } from '@/constants/(match)/account-options';

interface MatchTypeSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const MatchTypeSection = ({
  value,
  onChange,
}: MatchTypeSectionProps) => (
  <div>
    <p className="p-2">인원수 선택</p>
    <RadioGroup
      defaultValue="ONE_VS_ONE"
      className="!mt-2 grid grid-cols-2 gap-4"
      onValueChange={onChange}
    >
      {accountOptions.map((option) => (
        <OptionCard
          key={option.id}
          {...option}
          selectedValue={value}
          onValueChange={onChange}
        />
      ))}
    </RadioGroup>
  </div>
);
