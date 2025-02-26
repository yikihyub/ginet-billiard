'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BilliardSelect from '../select/billiard-select';
import { FormData } from '@/types/(match)';
import { FormField } from '../form/form-field';

interface PersonalInfoSectionProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (checked: boolean) => void;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  timeOptions: string[];
  onStoreSelect: (store: any) => void;
}

export const PersonalInfoSection = ({
  formData,
  onInputChange,
  onCheckboxChange,
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  timeOptions,
  onStoreSelect,
}: PersonalInfoSectionProps) => (
  <div>
    <p className="mt-2 p-2">개인정보</p>
    <Card className="!mt-2 p-4">
      <div className="space-y-6">
        <FormField
          label="이름"
          id="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="이름을 입력해주세요"
          required
        />

        <FormField
          label="연락받을 휴대폰 번호"
          id="phone"
          value={formData.phone}
          onChange={onInputChange}
          placeholder="010-0000-0000"
          required
        />

        <FormField
          label="본인 다마"
          id="handicap"
          value={formData.handicap}
          onChange={onInputChange}
          placeholder="본인의 다마를 적어주세요."
          type="number"
          required
        />

        <DateTimeSelector
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          selectedTime={selectedTime}
          onTimeSelect={onTimeSelect}
          timeOptions={timeOptions}
        />

        <StoreSelector store={formData.store} onSelect={onStoreSelect} />

        <TermsAgreement
          checked={formData.agreeToTerms}
          onChange={onCheckboxChange}
        />
      </div>
    </Card>
  </div>
);
