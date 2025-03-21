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
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
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
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
