'use client';

import React, { useState } from 'react';
import { Book, X } from 'lucide-react';
import { useClubRegister } from '../context/club-register-context';

export const RulesStep = () => {
  const { clubInfo, addRule, removeRule, updateRule } = useClubRegister();
  const [ruleInput, setRuleInput] = useState('');

  const handleAddRule = () => {
    const trimmedRule = ruleInput.trim();
    if (trimmedRule) {
      addRule(trimmedRule);
      setRuleInput('');
    }
  };

  return (
    <>
      <h2 className="text-md mb-2 font-bold">동호회 규칙을 설정해주세요</h2>
      <p className="mb-6 text-sm text-gray-500">
        원활한 동호회 운영을 위한 규칙을 정해주세요
      </p>

      {/* 현재 step에 맞는 컴포넌트 렌더링 */}

      <div className="space-y-4">
        <div>
          <label className="mb-1 block flex items-center text-sm font-medium">
            <Book className="mr-1 h-4 w-4" />
            동호회 규칙
          </label>

          {/* 입력 필드 */}
          <div className="mb-4 mt-2 flex items-center gap-2">
            <input
              type="text"
              value={ruleInput}
              onChange={(e) => setRuleInput(e.target.value)}
              placeholder="규칙을 입력하세요 (예: 월 회비 1만원)"
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddRule}
              className="rounded-lg bg-green-500 px-3 py-2 text-white hover:bg-green-600"
            >
              추가
            </button>
          </div>

          {/* 규칙 리스트 (빈 값 제외) */}
          {clubInfo.rules.filter(Boolean).length > 0 && (
            <ul className="space-y-2">
              {clubInfo.rules.filter(Boolean).map((rule, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
                >
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                    className="flex-1 border-none bg-transparent focus:outline-none focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
