'use client';

import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import OptionCard from '../optioncard/option-card';
import { accountOptions } from '@/constants/(match)/account-options';
import { useMatchRegister } from '../context/match-register-context';

export default function Step1PeopleSelect() {
  const { accountSelectedValue, setAccountSelectedValue, setStep } =
    useMatchRegister();

  const handleNext = () => {
    setStep(2);
  };

  return (
    <div className="flex-1">
      <div className="mb-8">
        <h1 className="mb-1 text-xl font-bold">인원수를</h1>
        <h2 className="text-xl font-bold">선택해 주세요.</h2>
      </div>

      <RadioGroup
        defaultValue="ONE_VS_ONE"
        className="space-y-8"
        onValueChange={setAccountSelectedValue}
      >
        {accountOptions.map((option, index) => (
          <OptionCard
            key={option.id}
            {...option}
            selectedValue={accountSelectedValue}
            onValueChange={setAccountSelectedValue}
            imagePosition={index % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </RadioGroup>

      <Button
        className="mt-8 h-14 w-full rounded bg-green-600 text-lg font-medium text-white"
        onClick={handleNext}
      >
        다음
      </Button>
    </div>
  );
}
