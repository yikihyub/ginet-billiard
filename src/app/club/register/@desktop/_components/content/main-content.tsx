'use client';

import { TermsAgreement } from '../step/terms-step';
import { TypeSelectStep } from '../step/type-select-step';
import { BasicInfoStep } from '../step/basic-info-step';
import { DetailsStep } from '../step/detail-step';
import { RulesStep } from '../step/rules-step';
import { LocationStep } from '../step/location-step';
import { ContactStep } from '../step/contact-step';
import { ReviewStep } from '../step/review-step';
import { stepTitles } from '../title/step-title';

import { useClubRegister } from '../../../_components/context/club-register-context';

// 현재 스텝에 맞는 컴포넌트 매칭
const stepComponents: Record<string, JSX.Element> = {
  agreement: <TermsAgreement />,
  type: <TypeSelectStep />,
  basic: <BasicInfoStep />,
  details: <DetailsStep />,
  rules: <RulesStep />,
  location: <LocationStep />,
  contact: <ContactStep />,
  review: <ReviewStep />,
};

const MainContent = () => {
  const { currentStep } = useClubRegister();
  const stepInfo = stepTitles[currentStep];

  return (
    <main className="flex-1 p-8">
      <h2 className="mb-2 text-xl font-bold">{stepInfo.title}</h2>
      <p className="mb-6 text-sm text-gray-500">{stepInfo.description}</p>

      {/* 현재 step에 맞는 컴포넌트 렌더링 */}
      {stepComponents[currentStep] || null}
    </main>
  );
};

export default MainContent;
