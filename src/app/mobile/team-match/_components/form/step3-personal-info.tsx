'use client';

import { useForm } from 'react-hook-form';
import { useMatchRegisterContext } from '@/app/mobile/team-match/_components/context/match-register-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar_custom';
import { ko } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { timeOptions } from '@/utils/(team-match)/form';

type Step3Inputs = {
  name: string;
  phone: string;
  handicap: string;
};

export default function Step3PersonalInfo() {
  const {
    formData,
    setFormData,
    setStep,
    step,
    preferredDate,
    setPreferredDate,
    preferredTime,
    setPreferredTime,
  } = useMatchRegisterContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Inputs>({
    defaultValues: {
      name: formData.name,
      phone: formData.phone,
      handicap: formData.handicap,
    },
  });

  const onSubmit = (data: Step3Inputs) => {
    if (!preferredDate || !preferredTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      ...data,
    }));

    setStep(step + 1);
  };

  const goBack = () => setStep(step - 1);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
      <div className="mb-8">
        <h1 className="mb-1 text-xl font-bold">개인정보를</h1>
        <h2 className="text-xl font-bold">입력해 주세요.</h2>
      </div>

      <div>
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          {...register('name', { required: '이름을 입력해주세요' })}
          className="mt-2 h-14 border-none bg-gray-100 text-lg"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">휴대폰 번호</Label>
        <Input
          id="phone"
          {...register('phone', { required: '전화번호를 입력해주세요' })}
          className="mt-2 h-14 border-none bg-gray-100 text-lg"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="handicap">본인 점수</Label>
        <Input
          id="handicap"
          {...register('handicap', {
            required: '점수를 입력해주세요',
            pattern: {
              value: /^[0-9]+$/,
              message: '숫자만 입력해주세요',
            },
          })}
          className="mt-2 h-14 border-none bg-gray-100 text-lg"
        />
        {errors.handicap && (
          <p className="text-sm text-red-500">{errors.handicap.message}</p>
        )}
      </div>

      <div>
        <Label>매칭 시간</Label>
        <Select value={preferredTime} onValueChange={setPreferredTime}>
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
        <Label>매칭 날짜</Label>
        <Calendar
          mode="single"
          selected={preferredDate ?? undefined}
          onSelect={(date) => setPreferredDate(date ?? null)}
          locale={ko}
          className="mt-2 rounded-md border"
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
        />
      </div>

      <div className="mt-8 flex gap-4">
        <Button
          type="button"
          onClick={goBack}
          className="h-14 w-full rounded bg-gray-200 text-lg font-medium text-black"
        >
          이전
        </Button>
        <Button
          type="submit"
          className="h-14 w-full rounded bg-green-600 text-lg font-medium text-white"
        >
          다음
        </Button>
      </div>
    </form>
  );
}
