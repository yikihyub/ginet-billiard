"use client";

import React, { useState } from "react";

export default function ProgressStepForm() {
  const [step, setStep] = useState(1); // 현재 단계 상태

  // 다음 단계로 이동
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-full bg-gray-200 h-2 rounded-full relative">
          <div
            className="absolute h-2 bg-yellow-400 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }} // 단계에 따라 너비 변경
          ></div>
        </div>
      </div>

      {/* 폼 단계 표시 */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold mb-4">1단계: 이메일 입력</h2>
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
          <button
            onClick={handleNext}
            className="w-full mt-4 bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500"
          >
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold mb-4">2단계: 비밀번호 입력</h2>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              className="bg-gray-300 text-black py-2 px-4 rounded-lg"
            >
              이전
            </button>
            <button
              onClick={handleNext}
              className="bg-yellow-400 text-black py-2 px-4 rounded-lg hover:bg-yellow-500"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-lg font-bold mb-4">3단계: 확인</h2>
          <p>모든 정보를 확인한 후 로그인 버튼을 눌러주세요.</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              className="bg-gray-300 text-black py-2 px-4 rounded-lg"
            >
              이전
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
              로그인 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
