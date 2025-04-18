'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Step1 from '../_components/(mobile)/step1';
import Step2 from '../_components/(mobile)/step2';
import Step3 from '../_components/(mobile)/step3';
import Step4 from '../_components/(mobile)/step4';
import Step5 from '../_components/(mobile)/step5';
import { UserInfo, FormData } from '@/types/(signin)/mobile';

export default function SignupPage() {
  const totalSteps = 6;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agreements: {
      all: false,
      age: false,
      terms: false,
      privacy: false,
      marketing: false,
    },
    userInfo: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      phone: '',
    },
  });

  const handleAllAgreement = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreements: {
        all: checked,
        age: checked,
        terms: checked,
        privacy: checked,
        marketing: checked,
      },
    }));
  };

  const handleSingleAgreement = (name: string, checked: boolean) => {
    setFormData((prev) => {
      const newAgreements = {
        ...prev.agreements,
        [name]: checked,
      };

      // 모든 항목이 체크되었는지 확인
      const allChecked = Object.keys(newAgreements)
        .filter((key) => key !== 'all')
        .every((key) => newAgreements[key as keyof typeof newAgreements]);

      return {
        ...prev,
        agreements: {
          ...newAgreements,
          all: allChecked,
        },
      };
    });
  };

  const handleFormSubmit = (data: UserInfo) => {
    setFormData((prev) => ({
      ...prev,
      userInfo: data,
    }));
    setStep((prev) => prev + 1);
  };

  const handleNext = () => {
    if (step === 1) {
      if (
        formData.agreements.age &&
        formData.agreements.terms &&
        formData.agreements.privacy
      ) {
        setStep(2);
      } else {
        alert('필수 약관에 모두 동의해주세요.');
      }
    }
    // step 2일 때는 form의 handleNext가 호출됨
    else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="mt-20 flex-1 p-4">
        {step === 1 && (
          <Step1
            agreements={formData.agreements}
            onAllAgreement={handleAllAgreement}
            onSingleAgreement={handleSingleAgreement}
          />
        )}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 onNext={handleFormSubmit} />}
        {step === 5 && <Step5 />}

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
          <Button
            onClick={handleNext}
            className="h-14 w-full rounded-lg bg-green-600 hover:bg-green-700"
            disabled={step === 1 && !formData.agreements.age}
          >
            {step === totalSteps ? '가입하기' : `다음 (${step}/${totalSteps})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
