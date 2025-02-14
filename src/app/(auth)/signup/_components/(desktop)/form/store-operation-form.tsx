import React from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { StoreOperationFormProps } from '@/types/(login)/store-operation-info';

import {
  BRANDS,
  DAYS,
  FACILITIES,
} from '@/constants/(login)/store-operation-form/store-operation-form';

import { useStoreOperation } from '@/hooks/login/useStoreOperation';

export function StoreOperationForm({ onNext }: StoreOperationFormProps) {
  const {
    formData,
    errors,
    showError,
    setErrors,
    setFormData,
    handleTimeChange,
    handleHolidayChange,
    handleFacilityChange,
    handleSubmit,
  } = useStoreOperation(onNext);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">운영 정보 입력</h1>
        <p className="mt-2 text-gray-600">매장 운영 정보를 입력해주세요.</p>
      </div>

      {showError && (
        <Alert variant="destructive">
          <AlertDescription>필수 항목을 모두 입력해주세요.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* 평일 운영시간 */}
        <div className="space-y-2">
          <Label>
            평일 운영시간 <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={formData.weekdayHours.open}
              onChange={(e) =>
                handleTimeChange('weekdayHours', 'open', e.target.value)
              }
            />
            <span>~</span>
            <Input
              type="time"
              value={formData.weekdayHours.close}
              onChange={(e) =>
                handleTimeChange('weekdayHours', 'close', e.target.value)
              }
            />
          </div>
          {errors.weekdayHours && (
            <p className="text-sm text-red-500">{errors.weekdayHours}</p>
          )}
        </div>

        {/* 토요일 운영시간 */}
        <div className="space-y-2">
          <Label>토요일 운영시간</Label>
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={formData.saturdayHours.open}
              onChange={(e) =>
                handleTimeChange('saturdayHours', 'open', e.target.value)
              }
            />
            <span>~</span>
            <Input
              type="time"
              value={formData.saturdayHours.close}
              onChange={(e) =>
                handleTimeChange('saturdayHours', 'close', e.target.value)
              }
            />
          </div>
        </div>

        {/* 일요일 운영시간 */}
        <div className="space-y-2">
          <Label>일요일 운영시간</Label>
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={formData.sundayHours.open}
              onChange={(e) =>
                handleTimeChange('sundayHours', 'open', e.target.value)
              }
            />
            <span>~</span>
            <Input
              type="time"
              value={formData.sundayHours.close}
              onChange={(e) =>
                handleTimeChange('sundayHours', 'close', e.target.value)
              }
            />
          </div>
        </div>

        {/* 정기휴일 */}
        <div className="space-y-2">
          <Label>정기휴일</Label>
          <div className="grid grid-cols-2 gap-2">
            {DAYS.map((day) => (
              <label key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.regularHolidays.includes(day.value)}
                  onCheckedChange={() => handleHolidayChange(day.value)}
                />
                <span>{day.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 브랜드 */}
        <div className="space-y-2">
          <Label htmlFor="brand">
            브랜드 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.brand}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, brand: value }));
              setErrors((prev) => ({ ...prev, brand: undefined }));
            }}
          >
            <SelectTrigger id="brand">
              <SelectValue placeholder="브랜드를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((brand) => (
                <SelectItem key={brand.value} value={brand.value}>
                  {brand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.brand && (
            <p className="text-sm text-red-500">{errors.brand}</p>
          )}
        </div>

        {/* 타석 수 */}
        <div className="space-y-2">
          <Label htmlFor="totalTables">
            타석 수 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="totalTables"
            type="number"
            min="1"
            placeholder="타석 수를 입력해주세요"
            value={formData.totalTables}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, totalTables: e.target.value }));
              setErrors((prev) => ({ ...prev, totalTables: undefined }));
            }}
          />
          {errors.totalTables && (
            <p className="text-sm text-red-500">{errors.totalTables}</p>
          )}
        </div>

        {/* 편의시설 */}
        <div className="space-y-2">
          <Label>보유 편의시설</Label>
          <div className="grid grid-cols-2 gap-2">
            {FACILITIES.map((facility) => (
              <label key={facility.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.facilities.includes(facility.id)}
                  onCheckedChange={() => handleFacilityChange(facility.id)}
                />
                <span>{facility.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full"
          // onClick={onPrev}
        >
          이전
        </Button>
        <Button type="submit" className="h-12 w-full">
          다음
        </Button>
      </div>
    </form>
  );
}
