'use client';

import React, { useState } from 'react';
import { Hash, X } from 'lucide-react';
import { useClubRegister } from '../../../_components/context/club-register-context';
import { Badge } from '@/components/ui/badge'; // ShadCN-UI Badge import

export const DetailsStep = () => {
  const { clubInfo, updateClubInfo, addTag, removeTag } = useClubRegister();
  const [tagInput, setTagInput] = useState('');

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateClubInfo('description', e.target.value);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag) {
      addTag(trimmedTag);
      setTagInput('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          동호회 소개 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={clubInfo.description}
          onChange={handleDescriptionChange}
          placeholder="동호회에 대한 소개를 작성해주세요"
          className="h-32 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-1 block flex items-center text-sm font-medium">
          <Hash className="mr-1 h-4 w-4" />
          해시태그
        </label>

        {/* 태그 입력 필드 */}
        <div className="mb-4 mt-2 flex items-center gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="해시태그 입력 (예: 4구)"
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
          >
            추가
          </button>
        </div>

        {/* 태그 리스트 (빈 값 제외) */}
        {clubInfo.tags.filter(Boolean).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {clubInfo.tags.filter(Boolean).map((tag, index) => (
              <Badge
                key={index}
                className="flex items-center space-x-1 px-3 py-1"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-white hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
