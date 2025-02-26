'use client';

import { RadioGroup } from '@/components/ui/radio-group';
import OptionCard from '../optioncard/option-card';
import { gameOptions } from '@/constants/(match)/game-options';

interface GameTypeSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const GameTypeSection = ({ value, onChange }: GameTypeSectionProps) => (
  <div>
    <p className="mt-2 p-2">게임종류 선택</p>
    <RadioGroup
      defaultValue="FOUR_BALL"
      className="!mt-2 grid grid-cols-3 gap-4"
      onValueChange={onChange}
    >
      {gameOptions.map((option) => (
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
