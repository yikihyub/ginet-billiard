'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Users, Calendar, Globe, AlertCircle, Check } from 'lucide-react';

import { cn } from '@/lib/utils';

type ClubType = '3구' | '4구' | '포켓볼' | '종합';

interface FormData {
  type: ClubType | null;
  name: string;
  description: string;
  maxMembers: number;
  location: string;
  rules: string;
  image: File | null;
}

export default function RegisterMobilePage() {
  const [step, setStep] = useState(1);
  const [guidelineChecked, setGuidelineChecked] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: null,
    name: '',
    description: '',
    maxMembers: 0,
    location: '',
    rules: '',
    image: null,
  });

  const clubTypes = [
    {
      type: '3구' as ClubType,
      icon: <Zap className="h-5 w-5" />,
      title: '3구',
      description: '3구 당구를 주로 치는 모임',
    },
    {
      type: '4구' as ClubType,
      icon: <Users className="h-5 w-5" />,
      title: '4구',
      description: '4구 당구를 주로 치는 모임',
    },
    {
      type: '포켓볼' as ClubType,
      icon: <Calendar className="h-5 w-5" />,
      title: '포켓볼',
      description: '포켓볼을 주로 치는 모임',
    },
    {
      type: '종합' as ClubType,
      icon: <Globe className="h-5 w-5" />,
      title: '종합',
      description: '다양한 당구를 함께 즐기는 모임',
    },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // 최종 제출 로직
      console.log('Final form data:', formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <main className="flex-1 p-4">
              {/* 경고 아이콘과 제목 */}
              <div className="mb-6">
                <div className="mb-2 inline-block rounded-full bg-red-100 p-2">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-xl font-bold">
                  모두가 즐거운 당구장 동호회가
                  <br />될 수 있도록 함께 지켜주세요
                </h2>
              </div>

              {/* 가이드라인 목록 */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-500">
                    1
                  </div>
                  <p className="text-gray-700">
                    모임 시작 전 불참이하게 참여가 어려워진 경우, 반드시
                    호스트에게 미리 알려주세요.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-500">
                    2
                  </div>
                  <p className="text-gray-700">
                    나와 다른 의견에도 귀 기울이며, 함께하는 멤버들을 존중하는
                    태도를 지켜주세요.
                  </p>
                </div>
              </div>

              {/* 경고 박스 */}
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  무단으로 불참하거나, 함께하는 멤버들을 존중하지 않고 피해를
                  주는 경우
                  <br />
                  신고 제도를 통해 문도 이용에 제재를 받게 됩니다.
                </p>
              </div>

              {/* 체크박스 */}
              <button
                className="mt-6 flex w-full items-center gap-2 rounded-lg bg-gray-100 p-4"
                onClick={() => setGuidelineChecked(!guidelineChecked)}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded border',
                    guidelineChecked
                      ? 'border-none bg-blue-500'
                      : 'border-gray-300 bg-white'
                  )}
                >
                  {guidelineChecked && <Check className="h-4 w-4 text-white" />}
                </div>
                <span className="text-sm">
                  당구장 동호회 이용 규칙을 지키겠습니다!
                </span>
              </button>
            </main>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="mb-2 text-xl font-bold">
              어떤 종류의 당구를 주로 치나요?
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              동호회의 주요 활동 유형을 선택해주세요
            </p>
            <div className="space-y-3">
              {clubTypes.map((clubType) => (
                <button
                  key={clubType.type}
                  className={cn(
                    'w-full rounded-lg border p-4 text-left transition-colors',
                    'hover:bg-gray-50',
                    formData.type === clubType.type
                      ? 'border-2 border-blue-500'
                      : 'border-gray-200'
                  )}
                  onClick={() =>
                    setFormData({ ...formData, type: clubType.type })
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'rounded-full p-2',
                        formData.type === clubType.type
                          ? 'bg-blue-50'
                          : 'bg-gray-50'
                      )}
                    >
                      {clubType.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{clubType.title}</h3>
                      <p className="text-sm text-gray-500">
                        {clubType.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="mb-2 text-xl font-bold">
              동호회의 기본 정보를 입력해주세요
            </h2>
            <div className="space-y-6">
              {/* 동호회 이름 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  동호회 이름
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="동호회 이름을 입력해주세요"
                  className="mt-1 h-14 border-none bg-gray-100 px-4"
                />
              </div>

              {/* 동호회 소개 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  동호회 소개
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="동호회에 대해 소개해주세요"
                  className="mt-1 min-h-[120px] border-none bg-gray-100 p-4"
                />
              </div>

              {/* 최대 인원 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  최대 인원
                </label>
                <Input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxMembers: parseInt(e.target.value),
                    })
                  }
                  placeholder="최대 인원을 입력해주세요"
                  className="mt-1 h-14 border-none bg-gray-100 px-4"
                />
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  동호회 대표 이미지
                </label>
                <div className="mt-1">
                  <div className="flex w-full items-center justify-center">
                    <label className="w-full cursor-pointer">
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-7">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-gray-400 group-hover:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="pt-1 text-sm text-gray-500">
                            사진을 업로드해주세요
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, image: file });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h2 className="mb-2 text-xl font-bold">
              동호회 활동 정보를 입력해주세요
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  주요 활동 지역
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="주로 활동하는 지역을 입력해주세요"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  동호회 규칙
                </label>
                <Textarea
                  value={formData.rules}
                  onChange={(e) =>
                    setFormData({ ...formData, rules: e.target.value })
                  }
                  placeholder="동호회 규칙을 입력해주세요"
                  className="mt-1"
                />
              </div>
            </div>
          </>
        );
    }
  };

  // isStepValid 수정
  const isStepValid = () => {
    switch (step) {
      case 1:
        return guidelineChecked; // 첫 화면에서는 체크박스만 확인
      case 2:
        return formData.type !== null;
      case 3:
        return formData.name && formData.description && formData.maxMembers > 0;
      case 4:
        return formData.location && formData.rules;
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-col bg-white">
      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-4">
        {renderStep()}
        {/* 하단 버튼 */}
        <div className="pb-10 pt-6">
          <button
            className={cn(
              'w-full rounded-lg py-4 transition-colors',
              isStepValid()
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-400'
            )}
            disabled={!isStepValid()}
            onClick={handleNext}
          >
            {step === 3 ? '동호회 만들기' : '다음'}
          </button>
        </div>
      </main>
    </div>
  );
}
