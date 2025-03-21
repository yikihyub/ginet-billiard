'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Tab() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || 'nearby'
  );

  // 탭 변경 함수
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);

    // URL 업데이트 (페이지 새로고침 없이)
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // 페이지 로드 시 URL에서 tab 파라미터 확인
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="flex space-x-2 border-b bg-white">
      <button
        className={`flex-1 px-4 py-2 text-sm font-medium ${
          activeTab === 'nearby'
            ? 'border-b-2 border-green-600 text-green-600'
            : 'text-gray-500'
        }`}
        onClick={() => handleTabChange('nearby')}
      >
        주변 매치
      </button>
      <button
        className={`flex-1 px-4 py-2 text-sm font-medium ${
          activeTab === 'registered'
            ? 'border-b-2 border-green-600 text-green-600'
            : 'text-gray-500'
        }`}
        onClick={() => handleTabChange('registered')}
      >
        등록 매치
      </button>
    </div>
  );
}
