'use client';

import React from 'react';
import { useClubRegister } from '../context/club-register-context';

export const ReviewStep = () => {
  const { clubInfo } = useClubRegister();

  return (
    <>
      <h2 className="text-md mb-2 font-bold">
        등록할 동호회 정보를 확인해주세요
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        제출 전 마지막으로 정보를 검토하세요
      </p>

      <div className="mb-28 space-y-6">
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 text-lg font-medium">기본 정보</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">동호회 유형:</span> {clubInfo.type}
            </p>
            <p>
              <span className="font-medium">동호회 이름:</span> {clubInfo.name}
            </p>
            <p>
              <span className="font-medium">지역:</span> {clubInfo.location}
            </p>
            <p>
              <span className="font-medium">최대 인원수:</span>{' '}
              {clubInfo.maxMembers}명
            </p>
            <p>
              <span className="font-medium">정기 모임:</span>{' '}
              {clubInfo.regularDay || '미지정'}
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-3 text-lg font-medium">상세 정보</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">동호회 소개:</span>
            </p>
            <p className="whitespace-pre-line text-sm text-gray-600">
              {clubInfo.description}
            </p>

            <p className="mt-3">
              <span className="font-medium">해시태그:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {clubInfo.tags
                .filter((tag) => tag !== '')
                .map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-3 text-lg font-medium">동호회 규칙</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            {clubInfo.rules
              .filter((rule) => rule !== '')
              .map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-3 text-lg font-medium">활동 장소</h3>
          <p>
            <span className="font-medium">장소명:</span>{' '}
            {clubInfo.placeName || '미지정'}
          </p>
          <p>
            <span className="font-medium">주소:</span>{' '}
            {clubInfo.placeAddress || '미지정'}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-3 text-lg font-medium">연락처</h3>
          <p>
            <span className="font-medium">전화번호:</span>{' '}
            {clubInfo.contactPhone || '미지정'}
          </p>
          <p>
            <span className="font-medium">이메일:</span>{' '}
            {clubInfo.contactEmail || '미지정'}
          </p>
        </div>
      </div>
    </>
  );
};
