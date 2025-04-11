'use client';

import React from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import NotcieCard from '../card/notice-card';
import SelectGroup from '../select/select-group';
import CategorySection from '../select/category-select';

import { useEvaluation } from '../context/evalueate-context';

export default function MatchEvaluatePage() {
  const {
    matchData,
    formData,
    categories,
    isSubmitting,
    isFormValid,
    updateFormData,
    handleCategoryOptionSelect,
    submitEvaluation,
  } = useEvaluation();

  // 매치 데이터가 없으면 로딩 표시 또는 오류 메시지
  if (!matchData) {
    return <div className="p-4 text-center">매치 정보를 불러오는 중...</div>;
  }

  // 승자 선택
  const handleWinnerSelect = (winnerId: string) => {
    updateFormData('match_result', winnerId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 내용 */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* 상대방 정보 */}
          <div className="mb-6 flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={matchData.target.image || '/logo/billiard-ball.png'}
                className="h-12 w-12"
                alt={matchData.target.name}
              />
              <AvatarFallback className="text-xl">
                {matchData.target.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="ml-3">
              <div className="font-medium">
                {matchData.target.name}님과의 경기
              </div>
              <div className="text-sm text-gray-500">
                {matchData.match_date} 경기
              </div>
            </div>
          </div>

          <NotcieCard />

          <div className="space-y-2">
            {/* 승패 선택 버튼 */}
            <Label className="text-sm font-bold">경기 결과</Label>
            <div>
              <Label className="mb-2 block text-sm">
                게임에서 승리한 회원을 선택해주세요
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={
                    formData.match_result === matchData.current_user_id
                      ? 'default'
                      : 'outline'
                  }
                  className={`focus:bg-green-600 focus:outline-none focus:ring-0 active:bg-green-700 ${formData.match_result === matchData.current_user_id ? 'bg-green-600 font-bold' : ''}`}
                  onClick={() =>
                    handleWinnerSelect(matchData.current_user_id || '')
                  }
                >
                  내가 이겼어요
                </Button>
                <Button
                  type="button"
                  variant={
                    formData.match_result === matchData.target.id
                      ? 'default'
                      : 'outline'
                  }
                  className={`focus:bg-green-600 focus:outline-none focus:ring-0 active:bg-green-700 ${formData.match_result === matchData.target.id ? 'bg-green-600 font-bold' : ''}`}
                  onClick={() => handleWinnerSelect(matchData.target.id)}
                >
                  {matchData.target.name}님이 이겼어요
                </Button>
              </div>
            </div>

            {/* 평균 게임 시간 */}
            <div className="space-y-2">
              <SelectGroup
                title="한 게임당 평균 시간은 얼마나 되나요?"
                options={[
                  { label: '20분 이내', value: 'under20min' },
                  { label: '20분~30분', value: '20to30min' },
                  { label: '30분~1시간', value: '30to1hours' },
                  { label: '1시간 이상', value: 'over1hours' },
                ]}
                selectedValue={formData.play_time}
                onChange={(value) => updateFormData('play_time', value)}
              />
            </div>

            {/* 게임 종목 */}
            <div className="space-y-2">
              <SelectGroup
                title="어떤 게임 종목을 진행했나요?"
                options={[
                  { label: '3구', value: '3ball' },
                  { label: '4구', value: '4ball' },
                  { label: '포켓볼', value: 'pocket' },
                ]}
                selectedValue={formData.game_type}
                onChange={(value) => updateFormData('game_type', value)}
              />
            </div>

            {/* 하이런 */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">
                당구 게임 내 상대방의 하이런은 얼마였나요?
              </Label>

              <input
                type="number"
                className="w-full rounded-md border border-gray-300 p-3"
                placeholder="숫자만 입력해주세요 (예: 5)"
                value={formData.high_run || ''}
                onChange={(e) =>
                  updateFormData(
                    'high_run',
                    Number(e.target.value) || undefined
                  )
                }
              />
            </div>

            {/* 카테고리 평가 */}
            <div className="mb-6">
              <CategorySection
                categories={categories}
                onSelect={handleCategoryOptionSelect}
              />
            </div>

            {/* 추가 의견 */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">
                더 남기고 싶은 말이 있나요?
              </Label>
              <textarea
                className="w-full rounded-md border border-gray-300 p-3"
                rows={4}
                placeholder="예) 실력이 좋아서 많이 배웠어요. 다음에도 같이 치고 싶어요."
                value={formData.comment || ''}
                onChange={(e) => updateFormData('comment', e.target.value)}
              ></textarea>
            </div>

            {/* 익명 설정 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.is_anonymous}
                onCheckedChange={(checked) =>
                  updateFormData('is_anonymous', !!checked)
                }
              />
              <label
                htmlFor="anonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                익명으로 평가하기
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="border-t p-4">
        <Button
          className="h-12 w-full rounded-md py-4 text-center font-medium text-white"
          variant={isFormValid ? 'default' : 'secondary'}
          disabled={!isFormValid || isSubmitting}
          onClick={submitEvaluation}
        >
          {isSubmitting ? '제출 중...' : '작성 완료'}
        </Button>
      </div>
    </div>
  );
}
