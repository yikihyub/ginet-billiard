'use client';

import React from 'react';

import ProgressBar from '../progress/progress-bar';
import Step1PeopleSelect from './step1-people-select';
import Step2GameSelect from './step2-game-select';
import Step3PersonalInfo from './step3-personal-info';
import Step4BilliardInfo from './step4-billiard-info';

import { useMatchRegister } from '../context/match-register-context';

export default function MatchRegisterForm() {
  const { step } = useMatchRegister();

  return (
    <div className="flex flex-col bg-white">
      <ProgressBar step={step} totalSteps={4} />
      {step === 1 && <Step1PeopleSelect />}
      {step === 2 && <Step2GameSelect />}
      {step === 3 && <Step3PersonalInfo />}
      {step === 4 && <Step4BilliardInfo />}
    </div>
  );
}
