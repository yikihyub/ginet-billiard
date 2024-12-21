"use client";

import React from "react";

interface Step1Props {
  agreements: {
    all: boolean;
    age: boolean;
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
  onAllAgreement: (checked: boolean) => void;
  onSingleAgreement: (name: string, checked: boolean) => void;
}

export default function Step1({
  agreements,
  onAllAgreement,
  onSingleAgreement,
}: Step1Props) {
  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">
          서비스 이용약관에
          <br />
          동의해주세요.
        </h2>

        {/* 약관 동의 */}
        <div className="space-y-4">
          {/* 전체 동의 */}
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              checked={agreements.all}
              onChange={(e) => onAllAgreement(e.target.checked)}
              className="mr-2"
            />
            <label className="font-medium">네, 모두 동의합니다.</label>
          </div>

          {/* 개별 동의 항목들 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreements.age}
                  onChange={(e) => onSingleAgreement("age", e.target.checked)}
                  className="mr-2"
                />
                <label>[필수] 만 14세 이상입니다.</label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={(e) => onSingleAgreement("terms", e.target.checked)}
                  className="mr-2"
                />
                <label>[필수] 서비스 이용약관 동의</label>
              </div>
              <button className="text-sm text-gray-500">보기</button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreements.privacy}
                  onChange={(e) =>
                    onSingleAgreement("privacy", e.target.checked)
                  }
                  className="mr-2"
                />
                <label>[필수] 개인정보 수집 및 이용 동의</label>
              </div>
              <button className="text-sm text-gray-500">보기</button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={(e) =>
                    onSingleAgreement("marketing", e.target.checked)
                  }
                  className="mr-2"
                />
                <label>[선택] 선택정보 수집 및 이용 동의</label>
              </div>
              <button className="text-sm text-gray-500">보기</button>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          선택 항목에 동의하지 않아도 서비스 이용이 가능합니다.
          <br />
          개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며
          <br />
          동의 거부 시 서비스 이용이 제한됩니다.
        </p>
      </div>
    </>
  );
}
