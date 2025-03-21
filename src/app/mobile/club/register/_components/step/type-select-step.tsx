'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Zap, Users, Calendar } from 'lucide-react';
import { useClubRegister } from '../context/club-register-context';

// 당구 유형 선택 컴포넌트
export const TypeSelectStep = () => {
  const { clubInfo, handleTypeSelect } = useClubRegister();

  const clubTypes = [
    {
      type: '3구' as const,
      icon: <Zap className="h-5 w-5" />,
      title: '3구',
      description: '3구 당구 동호회',
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50',
    },
    {
      type: '4구' as const,
      icon: <Users className="h-5 w-5" />,
      title: '4구',
      description: '4구 당구 동호회',
      color: 'text-green-500',
      bgColor: 'hover:bg-green-50',
    },
    {
      type: '포켓볼' as const,
      icon: <Calendar className="h-5 w-5" />,
      title: '포켓볼',
      description: '포켓볼 동호회',
      color: 'text-green-500',
      bgColor: 'hover:bg-green-50',
    },
    {
      type: '종합' as const,
      icon: <Calendar className="h-5 w-5" />,
      title: '종합',
      description: '모든 종류의 당구를 포함하는 종합 동호회',
      color: 'text-green-500',
      bgColor: 'hover:bg-green-50',
    },
  ];

  return (
    <>
      <h2 className="text-md mb-2 font-bold">
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
              clubInfo.type === clubType.type
                ? 'border-2 border-green-500'
                : 'border-gray-200'
            )}
            onClick={() => handleTypeSelect(clubType.type)}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'rounded-full p-2',
                  clubInfo.type === clubType.type ? 'bg-green-50' : 'bg-gray-50'
                )}
              >
                {clubType.icon}
              </div>
              <div>
                <h3 className="font-medium">{clubType.title}</h3>
                <p className="text-sm text-gray-500">{clubType.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
