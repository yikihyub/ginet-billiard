import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { usePreference } from '@/hooks/login/usePreference';
import { userPreferenceProps } from '@/types/(login)/user-preference-info';

export function UserPreferenceForm({ onNext }: userPreferenceProps) {
  const {
    formData,
    errors,
    showError,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
  } = usePreference(onNext);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">회원정보 입력</h1>
        <p className="mt-2 text-gray-600">회원정보를 입력해주세요.</p>
      </div>

      {showError && (
        <Alert variant="destructive">
          <AlertDescription>
            모든 필수 항목을 올바르게 입력해주세요.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="preferGame">
          선호 게임<span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => handleSelectChange('preferGame', value)}
        >
          <SelectTrigger className="h-12 rounded-md bg-gray-200 px-4 text-lg">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3구">3구</SelectItem>
            <SelectItem value="4구">4구</SelectItem>
            <SelectItem value="포켓볼">포켓볼</SelectItem>
            <SelectItem value="상관없음">상관없음</SelectItem>
          </SelectContent>
        </Select>
        {errors.preferGame && (
          <p className="text-sm text-red-500">{errors.preferGame}</p>
        )}
      </div>

      <div className="space-y-4">
        {/* 일반 점수 입력 필드 */}
        <div className="space-y-2">
          <Label htmlFor="userThreeAbility">
            3구점수 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="userThreeAbility"
            name="userThreeAbility"
            placeholder="점수를 입력하세요"
            value={formData.userThreeAbility}
            onChange={handleInputChange}
            maxLength={3}
            className="h-12 rounded-md bg-gray-200 px-4 text-lg"
            type="number"
          />
          {errors.userThreeAbility && (
            <p className="text-sm text-red-500">{errors.userThreeAbility}</p>
          )}
        </div>

        {/* 포켓볼 점수 입력 필드 */}
        <div className="space-y-2">
          <Label htmlFor="userFourAbility">
            4구 점수 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="userFourAbility"
            name="userFourAbility"
            placeholder="포켓볼 점수를 입력하세요"
            value={formData.userFourAbility}
            onChange={handleInputChange}
            maxLength={3}
            className="h-12 rounded-md bg-gray-200 px-4 text-lg"
            type="number"
          />
          {errors.userFourAbility && (
            <p className="text-sm text-red-500">{errors.userFourAbility}</p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="h-12 w-full">
          다음
        </Button>
      </div>
    </form>
  );
}
