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
    <div className="flex flex-col bg-white">
      <div className="mt-8 flex-1 p-4">
        <div>
          <h2 className="text-xl font-bold">매칭 정보 설정</h2>
          <p className="text-xs text-gray-600">
            더 나은 매칭을 위해 자세한 정보를 설정해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* 선호 연령대 */}
            <div className="space-y-2">
              <Label className="font-semibold">
                선호하는 상대방 연령대 (복수 선택 가능)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {AGE_GROUPS.map((age) => (
                  <label
                    key={age.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={formData.preferredAgeGroup.includes(age.value)}
                      onCheckedChange={(checked) =>
                        handlePreferredAgeGroupChange(
                          age.value,
                          checked as boolean
                        )
                      }
                    />
                    <span>{age.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 본인 구력 */}
            <div className="space-y-2">
              <Label className="font-semibold">본인 구력</Label>
              <div className="grid grid-cols-2 gap-2">
                {SKILL_LEVELS.map((level) => (
                  <label
                    key={level.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={formData.preferredSkillLevel.includes(
                        level.value
                      )}
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
              <Label className="font-semibold">주 종목</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLAY_STYLES.map((style) => (
                  <label
                    key={style.value}
                    className="flex items-center space-x-2"
                  >
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
              <Label className="font-semibold">
                선호 시간대 (복수 선택 가능)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {PREFERRED_TIMES.map((time) => (
                  <label
                    key={time.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      checked={formData.preferredTime.includes(time.value)}
                      onCheckedChange={(checked) =>
                        handlePreferredTimeChange(
                          time.value,
                          checked as boolean
                        )
                      }
                    />
                    <span>{time.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 선호 성별 */}
            <div className="space-y-2">
              <Label htmlFor="preferredGender" className="font-semibold">
                선호하는 상대방 성별
              </Label>
              <Select
                value={formData.preferredGender}
                onValueChange={handleGenderChange}
              >
                <SelectTrigger
                  id="preferredGender"
                  className="mt-1 h-14 border-0 bg-gray-100"
                >
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
              위치 정보 수집에 동의합니다{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="mb-8 mt-8 flex gap-2">
            <Button type="button" variant="outline" className="h-14 w-full">
              이전
            </Button>
            <Button
              type="submit"
              className="h-14 w-full bg-green-600 hover:bg-green-700"
              disabled={
                loading ||
                // !formData.locationConsent ||
                !formData.preferredSkillLevel.length
              }
            >
              다음
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
