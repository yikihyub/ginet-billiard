'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Home,
  Users,
  FileText,
  BarChart2,
  Bell,
  Image,
  Settings,
  Shield,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});
  const menuItems = [
    {
      icon: <Home size={18} />,
      title: '대시보드',
      path: '/superginet',
    },
    {
      icon: <Users size={18} />,
      title: '회원 관리',
      children: [
        { title: '전체 회원', path: '/superginet/users/allusers' },
        { title: '차단된 회원', path: '/superginet/users/blocked' },
      ],
    },
    {
      icon: <BarChart2 size={18} />,
      title: '통계',
      children: [
        { title: '접속자 현황', path: '/superginet/visitors' },
        { title: '방문자 분석', path: '/superginet/visitors/user-activity' },
      ],
    },
    {
      icon: <FileText size={18} />,
      title: '콘텐츠 관리',
      children: [
        { title: '공지사항', path: '/superginet/content-manage/notice' },
        { title: 'Q&A 관리', path: '/superginet/content-manage/qna' },
        { title: 'FAQ 관리', path: '/superginet/content-manage/faq' },
        { title: 'FAQ 카테고리', path: '/superginet/content-manage/category' },
        { title: '긴급 팝업', path: '/superginet/content-manage/popup' },
      ],
    },
    {
      icon: <Image size={18} />,
      title: '배너 관리',
      path: '/admin/banners',
    },
    {
      icon: <Bell size={18} />,
      title: '알림 관리',
      path: '/admin/notifications',
    },
    {
      icon: <Shield size={18} />,
      title: '보안',
      children: [
        { title: '접근 권한', path: '/admin/security/permissions' },
        { title: '로그인 기록', path: '/admin/security/login-logs' },
        { title: '활동 로그', path: '/admin/security/activity-logs' },
      ],
    },
    {
      icon: <AlertTriangle size={18} />,
      title: '신고 관리',
      path: '/superginet/report-mg',
    },
    {
      icon: <Settings size={18} />,
      title: '시스템 설정',
      path: '/admin/settings',
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`z-40 h-full border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'} `}
      >
        {/* 메뉴 리스트 */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-2 py-4">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-1">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {isOpen && <span>{item.title}</span>}
                    </div>
                    {isOpen && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openItems[index] ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* 하위 메뉴 */}
                  {openItems[index] && isOpen && (
                    <div className="ml-11 mt-1">
                      {item.children.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.path}
                          className="block py-2 pl-1 text-sm text-gray-500 hover:text-blue-600"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center rounded-md px-4 py-3 text-sm text-gray-700 hover:bg-gray-100`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isOpen && <span>{item.title}</span>}
                </Link>
              )}
            </div>
          ))}

          {/* 사이트 이동 */}
          <div className="mt-6 px-4 py-3">
            <Link
              href="/"
              className="flex items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <ExternalLink size={16} className="mr-2" />
              {isOpen && <span>사이트로 이동</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
