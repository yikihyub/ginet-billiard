import React from 'react';
import { Store } from '@/types/(reserve)';

interface BasicInfoProps {
  store: Store;
}

const BasicInfo = ({ store }: BasicInfoProps) => {
  return (
    <div className="border-b p-4">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-xl font-bold">{store?.name}</h1>
          <p className="text-gray-600">{store?.address}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{store?.hourly_rate}원</div>
          <div className="text-sm text-gray-500">/10분</div>
        </div>
      </div>
      <div className="flex space-x-2">
        <span className="rounded-full bg-gray-100 px-2 py-1 text-sm">
          4구 중대
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-sm">
          3구 중대
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-sm">
          포켓볼
        </span>
      </div>
    </div>
  );
};

export default BasicInfo;
