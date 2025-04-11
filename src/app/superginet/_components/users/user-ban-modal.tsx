'use client';

import React, { useState } from 'react';
import { UserBanModalProps } from '../../_types/user';

const UserBanModal: React.FC<UserBanModalProps> = ({
  userId,
  userName,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState(7); // 기본 7일
  const [customDuration, setCustomDuration] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    // 커스텀 기간 선택 시 해당 값 사용, 그렇지 않으면 선택된 기간 사용
    const banDuration = duration === -1 ? parseInt(customDuration) : duration;
    onConfirm(userId, reason, banDuration);
    resetForm();
  };

  const resetForm = () => {
    setReason('');
    setDuration(7);
    setCustomDuration('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-bold">사용자 차단</h2>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <div className="mb-4 border-l-4 border-yellow-400 bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>{userName}</strong> 회원을 차단하려고 합니다. 차단된
                    회원은 서비스 이용이 제한됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                차단 사유
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="차단 사유를 입력해주세요. (사용자에게 표시됩니다)"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                차단 기간
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-1"
                    name="duration"
                    value="1"
                    checked={duration === 1}
                    onChange={() => setDuration(1)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="duration-1"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    1일
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-3"
                    name="duration"
                    value="3"
                    checked={duration === 3}
                    onChange={() => setDuration(3)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="duration-3"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    3일
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-7"
                    name="duration"
                    value="7"
                    checked={duration === 7}
                    onChange={() => setDuration(7)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="duration-7"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    7일
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-30"
                    name="duration"
                    value="30"
                    checked={duration === 30}
                    onChange={() => setDuration(30)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="duration-30"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    30일
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-permanent"
                    name="duration"
                    value="-2"
                    checked={duration === -2}
                    onChange={() => setDuration(-2)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="duration-permanent"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    영구 차단
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-custom"
                    name="duration"
                    value="-1"
                    checked={duration === -1}
                    onChange={() => setDuration(-1)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="duration-custom"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    직접 입력
                  </label>
                  {duration === -1 && (
                    <input
                      type="number"
                      min="1"
                      className="ml-2 w-20 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      placeholder="일수"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!reason.trim() || (duration === -1 && !customDuration)}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                !reason.trim() || (duration === -1 && !customDuration)
                  ? 'cursor-not-allowed bg-red-300'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              차단하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBanModal;
