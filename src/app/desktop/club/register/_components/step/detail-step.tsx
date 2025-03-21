'use client';

import React, { useState } from 'react';
import { Hash, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useClubRegister } from '../context/club-register-context';
import { Badge } from '@/components/ui/badge';

export const DetailsStep = () => {
  const {
    clubInfo,
    updateClubInfo,
    addTag,
    removeTag,
    handleProfileImageUpload,
    handleBannerImageUpload,
    profileImagePreview,
    bannerImagePreview,
    removeProfileImage,
    removeBannerImage,
  } = useClubRegister();
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

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProfileImageUpload(file);
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBannerImageUpload(file);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* 프로필 이미지 업로드 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          동호회 대표 이미지 (프로필)
        </label>
        <div className="mt-1">
          {profileImagePreview ? (
            <div className="relative">
              <img
                src={profileImagePreview}
                alt="프로필 이미지 미리보기"
                className="h-40 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeProfileImage}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <label className="w-full cursor-pointer">
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200">
                  <div className="flex flex-col items-center justify-center pt-5">
                    <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      프로필 이미지를 업로드해주세요
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      권장 크기: 500x500, 최대 2MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* 배너 이미지 업로드 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          동호회 배너 이미지
        </label>
        <div className="mt-1">
          {bannerImagePreview ? (
            <div className="relative">
              <img
                src={bannerImagePreview}
                alt="배너 이미지 미리보기"
                className="h-40 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeBannerImage}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <label className="w-full cursor-pointer">
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200">
                  <div className="flex flex-col items-center justify-center pt-5">
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      배너 이미지를 업로드해주세요
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      권장 크기: 1200x300, 최대 5MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                />
              </label>
            </div>
          )}
        </div>
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
