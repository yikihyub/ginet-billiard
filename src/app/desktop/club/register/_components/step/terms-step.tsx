'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClubRegister } from '../context/club-register-context';

export const TermsAgreement = () => {
  const { isAgreed, handleAgreeAll, handleChange } = useClubRegister();

  return (
    <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* 전체 동의 섹션 */}
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
        onClick={handleAgreeAll}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
              isAgreed.terms && isAgreed.privacy
                ? 'bg-blue-600'
                : 'border-2 border-gray-300 bg-white'
            )}
          >
            {isAgreed.terms && isAgreed.privacy && (
              <Check className="h-4 w-4 text-white" />
            )}
          </div>
          <span className="font-medium">전체 동의 (필수 및 선택 포함)</span>
        </div>

        <div className="text-xs font-normal text-gray-500">
          모든 약관에 동의합니다
        </div>
      </button>

      {/* 구분선 */}
      <div className="h-px w-full bg-gray-200"></div>

      {/* 개별 동의 항목 */}
      <div className="space-y-4">
        <div className="flex items-start justify-between rounded-lg p-2 transition-colors hover:bg-gray-50">
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => handleChange('terms')}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded transition-colors',
                isAgreed.terms
                  ? 'bg-blue-600'
                  : 'border-2 border-gray-300 bg-white'
              )}
            >
              {isAgreed.terms && <Check className="h-3 w-3 text-white" />}
            </div>
            <div>
              <span className="font-medium">이용약관 동의</span>
              <span className="ml-1 text-sm text-red-500">*</span>
            </div>
          </label>
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-blue-600 hover:underline"
          >
            자세히
          </button>
        </div>

        <div className="flex items-start justify-between rounded-lg p-2 transition-colors hover:bg-gray-50">
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => handleChange('privacy')}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded transition-colors',
                isAgreed.privacy
                  ? 'bg-blue-600'
                  : 'border-2 border-gray-300 bg-white'
              )}
            >
              {isAgreed.privacy && <Check className="h-3 w-3 text-white" />}
            </div>
            <div>
              <span className="font-medium">개인정보 수집 및 이용 동의</span>
              <span className="ml-1 text-sm text-red-500">*</span>
            </div>
          </label>
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-blue-600 hover:underline"
          >
            자세히
          </button>
        </div>

        <div className="flex items-start justify-between rounded-lg p-2 transition-colors hover:bg-gray-50">
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => handleChange('marketing')}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded transition-colors',
                isAgreed.marketing
                  ? 'bg-blue-600'
                  : 'border-2 border-gray-300 bg-white'
              )}
            >
              {isAgreed.marketing && <Check className="h-3 w-3 text-white" />}
            </div>
            <div>
              <span className="font-medium">마케팅 및 광고 수신 동의</span>
              <span className="ml-1 text-sm text-gray-500">(선택)</span>
            </div>
          </label>
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-blue-600 hover:underline"
          >
            자세히
          </button>
        </div>
      </div>
    </div>
  );
};
