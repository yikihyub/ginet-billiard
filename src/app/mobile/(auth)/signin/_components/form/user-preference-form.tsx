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
    <div className="flex flex-col bg-white">
      <div className="mt-8 flex-1 p-4">
        <h2 className="text-xl font-bold">
          평소 본인의 점수를
          <br />
          선택해주세요.
        </h2>

        {showError && (
          <Alert variant="destructive">
            <AlertDescription>
              모든 필수 항목을 올바르게 입력해주세요.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="preferGame">
              선호 게임<span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange('preferGame', value)}
            >
              <SelectTrigger className="mt-1 h-14 border-0 bg-gray-100">
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
                className="mt-1 h-14 border-none bg-gray-100 px-4 text-lg"
                type="number"
              />
              {errors.userThreeAbility && (
                <p className="text-sm text-red-500">
                  {errors.userThreeAbility}
                </p>
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
                className="mt-1 h-14 border-none bg-gray-100 px-4 text-lg"
                type="number"
              />
              {errors.userFourAbility && (
                <p className="text-sm text-red-500">{errors.userFourAbility}</p>
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex gap-2 bg-white p-4">
            <Button type="button" variant="outline" className="h-14 w-full">
              이전
            </Button>
            <Button
              type="submit"
              className="h-14 w-full rounded-lg bg-green-600 hover:bg-green-700"
            >
              다음
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
