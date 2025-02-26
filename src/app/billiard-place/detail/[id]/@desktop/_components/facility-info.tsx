import Image from 'next/image';
import React from 'react';

import { Loader2 } from 'lucide-react';

const FacilityInfo = () => {
  return (
    <div className="border-b p-4">
      <h2 className="mb-4 text-lg font-bold">📌 당구장 정보</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">당구장 크기</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">국제식 대대</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">4구 당구대</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">3구 당구대</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">포켓볼</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">화장실</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">흡연실</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">주차</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <Loader2 className="animate-spin" />
          </div>
          <span className="text-gray-600">전기차</span>
        </div>
      </div>
    </div>
  );
};

export default FacilityInfo;
