'use client';

import React, { useState } from 'react';

import TermsForm from './terms-form';
import UserInfoPage from './user-info-form';
import SignupComplete from './sign-up-complete';

import { UserPreferenceForm } from './user-preference-form';
import { UserMatchingForm } from './user-matching-form';
import { FavoriteBilliardForm } from './user-place-form';
import { Step } from '@/types/(login)/form';

export function FormStepper() {
  const [currentStep, setCurrentStep] = useState<Step>('terms');

  const handleNext = (step: Step) => {
    setCurrentStep(step);
  };

  return (
    <div className="w-full">
      <div className="mt-6">
        {currentStep === 'terms' && (
          <TermsForm onNext={() => handleNext('userInfo')} />
        )}
        {currentStep === 'userInfo' && (
          <UserInfoPage onNext={() => handleNext('storeInfo')} />
        )}
        {currentStep === 'storeInfo' && (
          <UserPreferenceForm onNext={() => handleNext('operation')} />
        )}
        {currentStep === 'operation' && (
          <UserMatchingForm onNext={() => handleNext('facilities')} />
        )}
        {currentStep === 'facilities' && (
          <FavoriteBilliardForm onComplete={() => handleNext('complete')} />
        )}
        {currentStep === 'complete' && <SignupComplete />}
      </div>
    </div>
  );
}
