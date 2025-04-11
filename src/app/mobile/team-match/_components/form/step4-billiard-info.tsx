'use client';

import React, { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import BilliardSelect from '../select/billiard-select';

import { useMatchRegisterContext } from '@/app/mobile/team-match/_components/context/match-register-context';

export default function Step4BilliardInfo() {
  const {
    userId,
    formData,
    setFormData,
    step,
    setStep,
    accountSelectedValue,
    gameSelectedValue,
    preferredDate,
  } = useMatchRegisterContext();

  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!formData.store) {
      alert('당구장을 선택해주세요.');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('개인정보 활용에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/match/register/postreg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          matchType: accountSelectedValue,
          gameType: gameSelectedValue,
          preferredDate,
          playerInfo: {
            name: formData.name,
            phone: formData.phone,
            handicap: Number(formData.handicap),
            storeAddress: formData.store?.address || '',
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || '등록 실패');
      }

      alert('등록이 완료되었습니다!');
      // 이동할 페이지로 리디렉션
    } catch (error) {
      alert(
        `에러 발생: ${error instanceof Error ? error.message : '알 수 없는 에러'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="mb-8">
        <h1 className="mb-1 text-xl font-bold">당구장과 약관</h1>
        <h2 className="text-xl font-bold">정보를 입력해 주세요.</h2>
      </div>

      <div>
        <Label className="text-md font-bold">당구장 선택</Label>
        <BilliardSelect
          onSelect={(store) => setFormData((prev) => ({ ...prev, store }))}
          value={formData.store}
        />
        {!formData.store && (
          <p className="mt-1 text-sm text-red-500">당구장을 선택해주세요.</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Checkbox
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, agreeToTerms: checked === true }))
          }
        />
        <Label htmlFor="agreeToTerms" className="font-medium">
          개인정보 활용 동의 <span className="text-red-500">*</span>
        </Label>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        ※ 현재 지역 기준으로 매칭 지역에 등록됩니다.
      </p>

      <div className="mt-8 flex gap-4">
        <Button
          className="h-14 w-full rounded bg-gray-200 text-lg font-medium text-black"
          onClick={goBack}
        >
          이전
        </Button>
        <Button
          className="h-14 w-full rounded bg-green-600 text-lg font-medium text-white"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? '등록 중...' : '등록하기'}
        </Button>
      </div>
    </div>
  );
}
