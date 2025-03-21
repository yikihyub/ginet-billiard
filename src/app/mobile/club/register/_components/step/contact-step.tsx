'use client';

import React from 'react';
import { useClubRegister } from '../context/club-register-context';

export const ContactStep = () => {
  const { clubInfo, updateClubInfo } = useClubRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateClubInfo(name as keyof typeof clubInfo, value);
  };

  return (
    <>
      <h2 className="text-md mb-2 font-bold">연락처 정보를 입력해주세요</h2>
      <p className="mb-6 text-sm text-gray-500">
        문의할 수 있는 연락처를 제공해주세요
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            연락처 (전화번호)
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={clubInfo.contactPhone}
            onChange={handleChange}
            placeholder="전화번호를 입력하세요"
            className="mt-1 h-14 w-full border-none bg-gray-100 px-4"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            연락처 (이메일)
          </label>
          <input
            type="email"
            name="contactEmail"
            value={clubInfo.contactEmail}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            className="mt-1 h-14 w-full border-none bg-gray-100 px-4"
          />
        </div>
      </div>
    </>
  );
};
