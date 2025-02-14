'use client';

import React, { useState } from 'react';

import TermsForm from './terms-form';
import UserInfoPage from './user-info-form';
import { StoreInfoForm } from './store-info-form';
import { StoreOperationForm } from './store-operation-form';
import { StoreFacilitiesForm } from './store-facilities-form';
import { StoreLocationForm } from './store-location-form';
// import SignupComplete from "../card/complete-card";
// import { StepIndicator } from "../step/step-indicator";

type Step =
  | 'terms'
  | 'userInfo'
  | 'storeInfo'
  | 'locationInfo'
  | 'operation'
  | 'facilities'
  | 'complete';

export function FormStepper() {
  const [currentStep, setCurrentStep] = useState<Step>('terms');

  const handleNext = (step: Step) => {
    setCurrentStep(step);
  };

  return (
    <div className="w-full">
      {/* 진행 단계 표시 */}
      {/* <StepIndicator currentStep={currentStep} /> */}

      {/* 현재 단계에 따른 폼 렌더링 */}
      <div className="mt-6">
        {currentStep === 'terms' && (
          <TermsForm onNext={() => handleNext('userInfo')} />
        )}
        {currentStep === 'userInfo' && (
          <UserInfoPage onNext={() => handleNext('storeInfo')} />
        )}
        {currentStep === 'storeInfo' && (
          <StoreInfoForm onNext={() => handleNext('locationInfo')} />
        )}
        {currentStep === 'locationInfo' && (
          <StoreLocationForm onNext={() => handleNext('operation')} />
        )}
        {currentStep === 'operation' && (
          <StoreOperationForm onNext={() => handleNext('facilities')} />
        )}
        {currentStep === 'facilities' && (
          <StoreFacilitiesForm onComplete={() => handleNext('complete')} />
        )}
        {/* {currentStep === 'complete' && <SignupComplete />} */}
      </div>
    </div>
  );
}
