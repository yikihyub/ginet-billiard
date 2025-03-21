'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useClubRegister } from '../context/club-register-context';

export const FooterButtons = () => {
  const {
    currentStep,
    validateStep,
    goToPrevStep,
    goToNextStep,
    handleSubmit,
    isLoading,
  } = useClubRegister();

  // 첫 번째 단계에서는 이전 버튼을 표시하지 않음
  const isFirstStep = currentStep === 'agreement';

  return (
    <div className="bottom-0 left-0 right-0 border-t bg-white p-4">
      {currentStep === 'review' ? (
        <button
          className="w-full rounded-lg bg-blue-500 py-3 font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? '등록 중...' : '동호회 등록하기'}
        </button>
      ) : (
        <div className="flex gap-3">
          {!isFirstStep && (
            <button
              className="w-1/2 rounded-lg py-3 font-medium text-gray-700 hover:bg-gray-50"
              onClick={goToPrevStep}
            >
              이전
            </button>
          )}
          <button
            className={cn(
              isFirstStep ? 'w-full' : 'w-1/2',
              'rounded-lg py-3 font-medium transition-colors',
              validateStep(currentStep)
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400'
            )}
            onClick={goToNextStep}
            disabled={!validateStep(currentStep)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};
