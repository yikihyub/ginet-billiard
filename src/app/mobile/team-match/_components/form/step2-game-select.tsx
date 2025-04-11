'use client';

import { useMatchRegisterContext } from '@/app/mobile/team-match/_components/context/match-register-context';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import OptionCard from '../optioncard/option-card';
import { gameOptions } from '@/constants/(match)/game-options';

export default function Step2GameSelect() {
  const { gameSelectedValue, setGameSelectedValue, setStep, step } =
    useMatchRegisterContext();

  const goNext = () => setStep(step + 1);
  const goBack = () => setStep(step - 1);

  return (
    <div className="flex-1">
      <div className="mb-8">
        <h1 className="mb-1 text-xl font-bold">게임 종류를</h1>
        <h2 className="text-xl font-bold">선택해 주세요.</h2>
      </div>

      <RadioGroup
        defaultValue={gameSelectedValue}
        className="space-y-8"
        onValueChange={setGameSelectedValue}
      >
        {gameOptions.map((option) => (
          <OptionCard
            key={option.id}
            {...option}
            selectedValue={gameSelectedValue}
            onValueChange={setGameSelectedValue}
            imagePosition="left"
          />
        ))}
      </RadioGroup>

      <div className="mt-8 flex gap-4">
        <Button
          className="h-14 w-full rounded bg-gray-200 text-lg font-medium text-black"
          onClick={goBack}
        >
          이전
        </Button>
        <Button
          className="h-14 w-full rounded bg-green-600 text-lg font-medium text-white"
          onClick={goNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
