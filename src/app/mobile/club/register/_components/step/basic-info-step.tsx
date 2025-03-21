'use client';

import React from 'react';
// import { MapPin } from 'lucide-react';
import { useClubRegister } from '../context/club-register-context';
import { RegionSelect } from '../select/region-select';

export const BasicInfoStep = () => {
  const { clubInfo, updateClubInfo } = useClubRegister();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateClubInfo(name as keyof typeof clubInfo, value);
  };

  return (
    <>
      <h2 className="text-md mb-2 font-bold">
        동호회 기본 정보를 입력해주세요
      </h2>
      <p className="mb-6 text-sm text-gray-500">동호회를 대표하는 정보입니다</p>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            동호회 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={clubInfo.name}
            onChange={handleChange}
            placeholder="동호회 이름을 입력하세요"
            className="mt-1 h-14 w-full border-none bg-gray-100 px-4"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            최대 인원수 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="maxMembers"
            value={clubInfo.maxMembers}
            onChange={handleChange}
            min="1"
            max="1000"
            className="mt-1 h-14 w-full border-none bg-gray-100 px-4"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            정기 모임 요일
          </label>
          <select
            name="regularDay"
            value={clubInfo.regularDay}
            onChange={handleChange}
            className="mt-1 h-14 w-full border-none bg-gray-100 px-4"
          >
            <option value="">선택해주세요</option>
            <option value="월요일">월요일</option>
            <option value="화요일">화요일</option>
            <option value="수요일">수요일</option>
            <option value="목요일">목요일</option>
            <option value="금요일">금요일</option>
            <option value="토요일">토요일</option>
            <option value="일요일">일요일</option>
            <option value="매주 주말">매주 주말</option>
            <option value="격주">격주</option>
            <option value="매월">매월</option>
            <option value="비정기">비정기</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            지역 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <RegionSelect value={clubInfo.location} onChange={handleChange} />
          </div>
        </div>
      </div>
    </>
  );
};
