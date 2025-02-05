'use client';

import { useState } from 'react';
import { ChevronRight, Zap, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type ClubType = '3구' | '4구' | '포켓볼' | '종합';

export default function RegisterDesktopPage() {
  const [selectedType, setSelectedType] = useState<ClubType | null>(null);

  const clubTypes = [
    {
      type: '3구' as ClubType,
      icon: <Zap className="h-5 w-5" />,
      title: '3구',
      description: '일회성 모임으로 만개처럼 가볍게 만나요',
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50',
    },
    {
      type: '4구' as ClubType,
      icon: <Users className="h-5 w-5" />,
      title: '4구',
      description: '지속적 모임으로 계속해서 친하게 지내요',
      color: 'text-green-500',
      bgColor: 'hover:bg-green-50',
    },
    {
      type: '포켓볼' as ClubType,
      icon: <Calendar className="h-5 w-5" />,
      title: '포켓볼',
      description: '같은 목표를 가진 멤버들과 함께 도전해요',
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-50',
    },
    {
      type: '종합' as ClubType,
      icon: <Calendar className="h-5 w-5" />,
      title: '종합',
      description: '같은 목표를 가진 멤버들과 함께 도전해요',
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-50',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-4">
        <h2 className="mb-2 text-xl font-bold">
          멤버들과 함께 어떤 활동을 하고싶나요?
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          활동 유형에 따라 동호회를 만들어보세요
        </p>

        <div className="space-y-3">
          {clubTypes.map((clubType) => (
            <button
              key={clubType.type}
              className={cn(
                'w-full rounded-lg border p-4 text-left transition-colors',
                clubType.bgColor,
                selectedType === clubType.type
                  ? 'border-2 border-blue-500'
                  : 'border-gray-200'
              )}
              onClick={() => setSelectedType(clubType.type)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'rounded-full p-2',
                    selectedType === clubType.type ? 'bg-blue-50' : 'bg-gray-50'
                  )}
                >
                  {clubType.icon}
                </div>
                <div>
                  <h3 className="font-medium">{clubType.title}</h3>
                  <p className="text-sm text-gray-500">
                    {clubType.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <button
          className={cn(
            'w-full rounded-lg py-4 transition-colors',
            selectedType
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-400'
          )}
          disabled={!selectedType}
        >
          다음
        </button>
      </div>
    </div>
  );
}
