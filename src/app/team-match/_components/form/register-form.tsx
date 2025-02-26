'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
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

import { FormData } from '@/types/(match)';
import { gameOptions } from '@/constants/(match)/game-options';
import { accountOptions } from '@/constants/(match)/account-options';
import BilliardSelect from '../select/billiard-select';

export default function MatchRegisterForm() {
  const router = useRouter();
  const toast = useToast();
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

      const data = await response.json();
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

  return (
    <div className="mx-auto max-w-[1024px]">
      <div className="space-y-8">
        {/* 매치 유형 */}
        <p className="p-2">인원수 선택</p>
        <RadioGroup
          defaultValue="ONE_VS_ONE"
          className="!mt-2 grid grid-cols-2 gap-4"
          onValueChange={(value) => setAccountSelectedValue(value)}
        >
          {accountOptions.map((option) => (
            <OptionCard
              key={option.id}
              {...option}
              selectedValue={accountSelectedValue}
              onValueChange={setAccountSelectedValue}
            />
          ))}
        </RadioGroup>

        {/* 게임 종류 타입 */}
        <p className="mt-2 p-2">게임종류 선택</p>
        <RadioGroup
          defaultValue="FOUR_BALL"
          className="!mt-2 grid grid-cols-3 gap-4"
          onValueChange={(value) => setGameSelectedValue(value)}
        >
          {gameOptions.map((option) => (
            <OptionCard
              key={option.id}
              {...option}
              selectedValue={gameSelectedValue}
              onValueChange={setGameSelectedValue}
            />
          ))}
        </RadioGroup>

        {/* 개인정보 */}
        <p className="mt-2 p-2">개인정보</p>
        <Card className="!mt-2 p-4">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="font-medium">
                이름<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="font-medium">
                연락받을 휴대폰 번호<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="010-0000-0000"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="handicap" className="font-medium">
                본인 다마<span className="text-red-500">*</span>
              </Label>
              <Input
                id="handicap"
                name="handicap"
                value={formData.handicap}
                onChange={handleInputChange}
                placeholder="본인의 다마를 적어주세요."
                className="mt-2"
                type="number"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  매칭 시간 *
                </label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full">
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
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  매칭 날짜 *
                </label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ko}
                  className="w-full rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="handicap" className="font-medium">
                당구장<span className="text-red-500">*</span>
              </Label>
              <BilliardSelect
                onSelect={(store) =>
                  setFormData((prev) => ({ ...prev, store }))
                }
                value={formData.store}
              />
              {!formData.store && (
                <p className="mt-1 text-sm text-red-500">
                  당구장을 선택해주세요.
                </p>
              )}
            </div>

            <div>
              <Label className="font-medium">
                개인정보 활용동의<span className="text-red-500">*</span>
              </Label>
              &nbsp;
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
                className="mt-2"
              />
              <p className="mt-1 text-sm text-gray-500">
                ※ 현재 지역 기준으로 매칭지역에 등록됩니다.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-4 mt-6 flex justify-center gap-4">
        <Button
          className="text-md h-12 w-full px-4 py-2"
          onClick={() => router.push('/matches')}
        >
          선수보기
        </Button>
        <Button
          className="text-md h-12 w-full px-4 py-2"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? '등록 중...' : '등록하기'}
        </Button>
      </div>
    </div>
  );
}
