import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center gap-2 bg-gray-50">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      <div className="">채팅방 목록을 불러오는 중...</div>
    </div>
  );
}
