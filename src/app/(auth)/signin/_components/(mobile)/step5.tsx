'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { RegionSelect } from '../region-select/region-select';

export default function Step5() {
  const [gender, setGender] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [region, setRegion] = useState('');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        기본 정보를 <br /> 입력해주세요
      </h2>

      <div className="space-y-4">
        {/* 성별 선택 */}
        <div>
          <label className="text-sm font-medium text-gray-700">성별</label>
          <div className="mt-1 flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={cn(
                'flex-1 rounded-lg border py-3',
                gender === 'male'
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300 text-gray-700'
              )}
            >
              남성
            </button>
            <button
              onClick={() => setGender('female')}
              className={cn(
                'flex-1 rounded-lg border py-3',
                gender === 'female'
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300 text-gray-700'
              )}
            >
              여성
            </button>
          </div>
        </div>

        {/* 연령대 선택 */}
        <div>
          <label className="text-sm font-medium text-gray-700">연령대</label>
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger className="mt-1 h-14 border-0 bg-gray-100">
              <SelectValue placeholder="연령대를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10s">10대</SelectItem>
              <SelectItem value="20s">20대</SelectItem>
              <SelectItem value="30s">30대</SelectItem>
              <SelectItem value="40s">40대</SelectItem>
              <SelectItem value="50s">50대</SelectItem>
              <SelectItem value="60s">60대 이상</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          {/* 지역 선택 */}
          <label className="text-sm font-medium text-gray-700">선호 지역</label>
          <RegionSelect />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <button
          className={cn(
            'w-full rounded-lg p-4',
            gender && ageGroup && region
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-400'
          )}
          disabled={!gender || !ageGroup || !region}
        >
          다음
        </button>
      </div>
    </div>
  );
}
