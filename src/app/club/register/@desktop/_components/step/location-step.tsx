'use client';

import React from 'react';

import BilliardSelect from '@/app/team-match/@desktop/_components/select/billiard-select';
import { useClubRegister } from '../../../_components/context/club-register-context';

interface Store {
  id: number;
  name: string;
  owner_name: string | null;
  address: string;
}

export const LocationStep = () => {
  const { clubInfo, updateClubInfo } = useClubRegister();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateClubInfo(name as keyof typeof clubInfo, value);
  };

  // 선택된 매장을 context에 저장하는 함수
  const handleStoreSelect = (store: Store | null) => {
    if (store) {
      updateClubInfo('placeName', store.name);
      updateClubInfo('placeAddress', store.address);
    } else {
      updateClubInfo('placeName', '');
      updateClubInfo('placeAddress', '');
    }
  };

  // Store 객체 생성 (선택된 매장이 있는 경우에만)
  const selectedStore: Store | null =
    clubInfo.placeName && clubInfo.placeAddress
      ? {
          id: 0, // 임시 ID, 실제 선택한 매장의 ID가 저장되어 있다면 그것을 사용
          name: clubInfo.placeName,
          owner_name: null,
          address: clubInfo.placeAddress,
        }
      : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">당구장 선택</label>
        <BilliardSelect onSelect={handleStoreSelect} value={selectedStore} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          주요 활동 장소명
        </label>
        <input
          type="text"
          name="placeName"
          value={clubInfo.placeName}
          onChange={handleChange}
          placeholder="당구장 이름을 입력하세요"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          주요 활동 장소 주소
        </label>
        <textarea
          name="placeAddress"
          value={clubInfo.placeAddress}
          onChange={handleChange}
          placeholder="당구장 주소를 입력하세요"
          className="h-24 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
