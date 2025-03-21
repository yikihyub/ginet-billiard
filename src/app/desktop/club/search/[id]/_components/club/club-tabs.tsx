'use client';
import { ClubTabsProps } from '@/types/(club)/club';

export default function ClubTabs({ activeTab, setActiveTab }: ClubTabsProps) {
  const tabs = [
    { id: 'info', label: '정보' },
    { id: 'schedule', label: '일정' },
    { id: 'gallery', label: '갤러리' },
    { id: 'members', label: '멤버' },
  ];

  return (
    <div className="mt-2 bg-white shadow-sm">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 border-b-2 py-3 font-medium ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
