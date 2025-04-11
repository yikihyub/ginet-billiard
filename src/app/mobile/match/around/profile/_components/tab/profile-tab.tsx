'use client';

import React, { useState } from 'react';
import ChartContainer from '../container/chart-container';
import ReviewContainer from '../container/review-container';

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState('정보');

  return (
    <>
      <div className="border-b bg-white">
        <div className="flex">
          <button
            className={`flex-1 py-3 ${activeTab === '정보' ? 'border-b-2 border-green-700 font-medium text-green-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('정보')}
          >
            정보
          </button>
          <button
            className={`flex-1 py-3 ${activeTab === '후기' ? 'border-b-2 border-green-700 font-medium text-green-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('후기')}
          >
            후기
          </button>
        </div>
      </div>
      {activeTab === '정보' ? <ChartContainer /> : <ReviewContainer />}
    </>
  );
}
