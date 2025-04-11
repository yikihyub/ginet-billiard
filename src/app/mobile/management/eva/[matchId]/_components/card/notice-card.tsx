import React from 'react';

export default function NotcieCard() {
  return (
    <>
      <div className="mb-4 rounded-lg bg-gray-100 p-4">
        <div className="flex items-start">
          <div className="mr-2 text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-700">
            정확한 후기 작성은 다른 플레이어들에게 큰 도움이 됩니다. 허위 사실을
            작성할 경우 다른 플레이어에게 피해를 줄 수 있으니 정직하게 작성해
            주세요.
          </p>
        </div>
      </div>
    </>
  );
}
