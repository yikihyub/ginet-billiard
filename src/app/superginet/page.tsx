import React from 'react';

export default function AdminPage() {
  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">관리자 대시보드</h2>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">전체 회원</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">오늘 방문자</h3>
          <p className="text-3xl font-bold">256</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">새 신고 건수</h3>
          <p className="text-3xl font-bold text-red-600">12</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium">최근 활동</h3>
        <p>여기에 최근 활동 내역이 표시됩니다.</p>
      </div>
    </>
  );
}
