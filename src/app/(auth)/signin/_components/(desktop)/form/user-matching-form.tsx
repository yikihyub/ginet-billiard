import React from 'react';

import { Label } from '@/components/ui/label';
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

import {
  AGE_GROUPS,
  SKILL_LEVELS,
  PLAY_STYLES,
  PREFERRED_TIMES,
} from '@/constants/(login)/user-match-form/user-match-form';
import { UserMatchingFormProps } from '@/types/(login)/user-match-info';

import { useMatching } from '@/hooks/login/useMatching';

export function UserMatchingForm({ onNext }: UserMatchingFormProps) {
  const {
    formData,
    error,
    loading,
    handleLocationConsent,
    handlePreferredAgeGroupChange,
    handleSkillLevelChange,
    handlePlayStyleChange,
    handlePreferredTimeChange,
    handleGenderChange,
    handleSubmit,
  } = useMatching(onNext);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">매칭 정보 설정</h1>
        <p className="mt-2 text-gray-600">
          더 나은 매칭을 위해 본인 실력과 선호하는 상대방의 정보를 설정해주세요.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* 선호 연령대 */}
        <div className="space-y-2">
          <Label>선호하는 상대방 연령대 (복수 선택 가능)</Label>
          <div className="grid grid-cols-2 gap-2">
            {AGE_GROUPS.map((age) => (
              <label key={age.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.preferredAgeGroup.includes(age.value)}
                  onCheckedChange={(checked) =>
                    handlePreferredAgeGroupChange(age.value, checked as boolean)
                  }
                />
                <span>{age.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 본인 구력 */}
        <div className="space-y-2">
          <Label>본인 구력</Label>
          <div className="grid grid-cols-2 gap-2">
            {SKILL_LEVELS.map((level) => (
              <label key={level.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.preferredSkillLevel.includes(level.value)}
                  onCheckedChange={(checked) =>
                    handleSkillLevelChange(level.value, checked as boolean)
                  }
                />
                <span>{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 종목 */}
        <div className="space-y-2">
          <Label>종목</Label>
          <div className="grid grid-cols-2 gap-2">
            {PLAY_STYLES.map((style) => (
              <label key={style.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.playStyle.includes(style.value)}
                  onCheckedChange={(checked) =>
                    handlePlayStyleChange(style.value, checked as boolean)
                  }
                />
                <span>{style.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 선호 시간대 */}
        <div className="space-y-2">
          <Label>선호하는 시간대 (복수 선택 가능)</Label>
          <div className="grid grid-cols-2 gap-2">
            {PREFERRED_TIMES.map((time) => (
              <label key={time.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.preferredTime.includes(time.value)}
                  onCheckedChange={(checked) =>
                    handlePreferredTimeChange(time.value, checked as boolean)
                  }
                />
                <span>{time.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 위치 정보 동의 */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="location-consent"
            checked={formData.locationConsent}
            onCheckedChange={(checked) =>
              handleLocationConsent(checked as boolean)
            }
            disabled={loading}
          />
          <label
            htmlFor="location-consent"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            위치 정보 수집에 동의합니다 <span className="text-red-500">*</span>
          </label>
        </div>

        {/* 선호 성별 */}
        <div className="space-y-2">
          <Label htmlFor="preferredGender">선호하는 상대방 성별</Label>
          <Select
            value={formData.preferredGender}
            onValueChange={handleGenderChange}
          >
            <SelectTrigger id="preferredGender">
              <SelectValue placeholder="선호하는 성별을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">상관없음</SelectItem>
              <SelectItem value="male">남성</SelectItem>
              <SelectItem value="female">여성</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" className="h-12 w-full">
          이전
        </Button>
        <Button
          type="submit"
          className="h-12 w-full"
          disabled={
            loading ||
            !formData.locationConsent ||
            !formData.preferredSkillLevel.length
          }
        >
          다음
        </Button>
      </div>
    </form>
  );
}
