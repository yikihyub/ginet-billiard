'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { ko } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import OptionCard from '../optioncard/option-card';
import BilliardSelect from '../select/billiard-select';

import { FormData } from '@/types/(match)';
import { gameOptions } from '@/constants/(match)/game-options';
import { accountOptions } from '@/constants/(match)/account-options';

export default function MatchRegisterForm() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [accountSelectedValue, setAccountSelectedValue] =
    useState('ONE_VS_ONE');
  const [gameSelectedValue, setGameSelectedValue] = useState('FOUR_BALL');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${String(hour).padStart(2, '0')}:${minute}`;
  });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    handicap: '',
    agreeToTerms: false,
    store: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: checked,
    }));
  };

  const goToNextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (
        !formData.name ||
        !formData.phone ||
        !formData.handicap ||
        !selectedDate ||
        !selectedTime
      ) {
        toast.toast({
          title: '입력 오류',
          description: '모든 필수 항목을 입력해주세요.',
          variant: 'destructive',
        });
        return;
      }
      setStep(4);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (
        !formData.name ||
        !formData.phone ||
        !formData.handicap ||
        !formData.store
      ) {
        toast.toast({
          title: '입력 오류',
          description: '모든 필수 항목을 입력해주세요.',
          variant: 'destructive',
        });
        return;
      }

      if (!formData.agreeToTerms) {
        toast.toast({
          title: '약관 동의 필요',
          description: '개인정보 활용에 동의해주세요.',
          variant: 'destructive',
        });
        return;
      }

      if (!selectedDate || !selectedTime) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
      }

      const handicapNum = parseInt(formData.handicap);
      if (isNaN(handicapNum)) {
        toast.toast({
          title: '입력 오류',
          description: '다마는 숫자로 입력해주세요.',
          variant: 'destructive',
        });
        return;
      }

      const [hours, minutes] = selectedTime.split(':');
      const preferredDate = new Date(selectedDate);
      preferredDate.setHours(parseInt(hours), parseInt(minutes));

      const response = await fetch('/api/match/register/postreg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          matchType: accountSelectedValue,
          gameType: gameSelectedValue,
          preferredDate: preferredDate,
          playerInfo: {
            name: formData.name,
            phone: formData.phone,
            handicap: handicapNum,
            storeAddress: formData.store.address,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '매치 등록에 실패했습니다.');
      }

      toast.toast({
        title: '등록 완료',
        description: '매치가 성공적으로 등록되었습니다!',
      });
      router.push('/match'); // 매치 목록 페이지로 이동
    } catch (error) {
      console.error('Match registration error:', error);
      toast.toast({
        title: '등록 실패',
        description:
          error instanceof Error
            ? error.message
            : '매치 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => {
    const progress = (step / 4) * 100;
    return (
      <div className="mb-8 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-gray-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  // Step 1: 인원수 선택
  const renderPeopleSelection = () => {
    return (
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="mb-1 text-xl font-bold">인원수를</h1>
          <h2 className="text-xl font-bold">선택해 주세요.</h2>
        </div>

        <RadioGroup
          defaultValue="ONE_VS_ONE"
          className="space-y-8"
          onValueChange={(value) => setAccountSelectedValue(value)}
        >
          {/* First option - Image on left */}
          <OptionCard
            key={accountOptions[0].id}
            {...accountOptions[0]}
            selectedValue={accountSelectedValue}
            onValueChange={setAccountSelectedValue}
            imagePosition="left"
          />

          {/* Second option - Image on right */}
          <OptionCard
            key={accountOptions[1].id}
            {...accountOptions[1]}
            selectedValue={accountSelectedValue}
            onValueChange={setAccountSelectedValue}
            imagePosition="right"
          />
        </RadioGroup>

        {/* Next button */}
        <Button
          className="mt-8 h-14 w-full rounded bg-black text-lg font-medium text-white"
          onClick={goToNextStep}
        >
          다음
        </Button>
      </div>
    );
  };

  // Step 2: 게임 종류 선택
  const renderGameSelection = () => {
    return (
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="mb-1 text-xl font-bold">게임종류를</h1>
          <h2 className="text-xl font-bold">선택해 주세요.</h2>
        </div>

        <RadioGroup
          defaultValue="FOUR_BALL"
          className="space-y-8"
          onValueChange={(value) => setGameSelectedValue(value)}
        >
          <OptionCard
            key={gameOptions[0].id}
            {...gameOptions[0]}
            selectedValue={gameSelectedValue}
            onValueChange={setGameSelectedValue}
            imagePosition="left"
          />

          <OptionCard
            key={gameOptions[1].id}
            {...gameOptions[1]}
            selectedValue={gameSelectedValue}
            onValueChange={setGameSelectedValue}
            imagePosition="left"
          />

          <OptionCard
            key={gameOptions[2].id}
            {...gameOptions[2]}
            selectedValue={gameSelectedValue}
            onValueChange={setGameSelectedValue}
            imagePosition="left"
          />
        </RadioGroup>

        <div className="mt-8 flex gap-4">
          <Button
            className="h-14 w-full rounded bg-gray-200 text-lg font-medium text-black"
            onClick={goBack}
          >
            이전
          </Button>
          <Button
            className="h-14 w-full rounded bg-black text-lg font-medium text-white"
            onClick={goToNextStep}
          >
            다음
          </Button>
        </div>
      </div>
    );
  };

  // Step 3: 개인정보 입력
  const renderPersonalInfo = () => {
    return (
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="mb-1 text-xl font-bold">개인정보를</h1>
          <h2 className="text-xl font-bold">입력해 주세요.</h2>
        </div>
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-md font-bold">
              이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="이름을 입력해주세요"
              className="mt-2 h-14 border-none bg-gray-100 text-lg"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-md font-bold">
              휴대폰 번호 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="010-0000-0000"
              className="mt-2 h-14 border-none bg-gray-100 text-lg"
            />
          </div>

          <div>
            <Label htmlFor="handicap" className="text-md font-bold">
              본인 다마 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="handicap"
              name="handicap"
              value={formData.handicap}
              onChange={handleInputChange}
              placeholder="본인의 다마를 적어주세요."
              className="mt-2 h-14 border-none bg-gray-100 text-lg"
              type="number"
            />
          </div>

          <div>
            <Label className="text-md font-bold">
              매칭 시간 <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="mt-2 h-14 border-none bg-gray-100 text-lg">
                <SelectValue placeholder="시간을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-md font-bold">
              매칭 날짜 <span className="text-red-500">*</span>
            </Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              className="mt-2 rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            className="h-14 w-full rounded bg-gray-200 text-lg font-medium text-black"
            onClick={goBack}
          >
            이전
          </Button>
          <Button
            className="h-14 w-full rounded bg-black text-lg font-medium text-white"
            onClick={goToNextStep}
          >
            다음
          </Button>
        </div>
      </div>
    );
  };

  // Step 4: 당구장 정보 입력
  const renderBilliardInfo = () => {
    return (
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="mb-1 text-xl font-bold">당구장과 약관</h1>
          <h2 className="text-xl font-bold">정보를 입력해 주세요.</h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="store" className="text-md font-bold">
              당구장 <span className="text-red-500">*</span>
            </Label>
            <BilliardSelect
              onSelect={(store) => setFormData((prev) => ({ ...prev, store }))}
              value={formData.store}
            />
            {!formData.store && (
              <p className="mt-1 text-sm text-red-500">
                당구장을 선택해주세요.
              </p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="agreeToTerms" className="font-medium">
                개인정보 활용동의<span className="text-red-500">*</span>
              </Label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              ※ 현재 지역 기준으로 매칭지역에 등록됩니다.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            className="h-14 w-full rounded bg-gray-200 text-lg font-medium text-black"
            onClick={goBack}
          >
            이전
          </Button>
          <Button
            className="h-14 w-full rounded bg-black text-lg font-medium text-white"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '등록 중...' : '등록하기'}
          </Button>
        </div>
      </div>
    );
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderPeopleSelection();
      case 2:
        return renderGameSelection();
      case 3:
        return renderPersonalInfo();
      case 4:
        return renderBilliardInfo();
      default:
        return renderPeopleSelection();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">{renderProgressBar()}</div>
      {renderCurrentStep()}
    </div>
  );
}
