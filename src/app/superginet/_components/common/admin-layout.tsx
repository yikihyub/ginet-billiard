'use client';

import React, { useState, useEffect } from 'react';

import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기에 따라 모바일 여부 설정
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // 최초 로드 시에만 사이드바 상태 설정
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // 초기 체크
    checkIsMobile();

    // 리사이즈 이벤트 리스너
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // 모바일 상태가 변경될 때만 사이드바 상태 업데이트
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 의존성 배열에 sidebarOpen 제거

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  // 모바일에서 사이드바 닫기
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <AdminHeader toggleSidebar={toggleSidebar} username="관리자명" />

      {/* 본문: 사이드바 + 페이지 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* 메인 컨텐츠 */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          onClick={isMobile ? closeSidebar : undefined}
        >
          <div className="rounded-lg bg-white p-6 shadow-sm">{children}</div>

          {/* 푸터 */}
          <footer className="mt-8 border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
            <p>&copy; 2025 당구장 관리자 시스템. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
