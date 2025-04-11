'use client';

import React from 'react';
import { Users, UserPlus, UserX, AlertTriangle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  isIncrease?: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
  linkText?: string;
  onClick?: () => void;
}

interface UserStatsProps {
  totalUsers: number;
  newUsers: number;
  bannedUsers: number;
  reportedUsers: number;
  isLoading?: boolean;
  onViewAll?: (category: string) => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isIncrease,
  icon,
  iconBgColor,
  linkText,
  onClick,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change !== undefined && (
              <span
                className={`ml-2 text-sm font-medium ${
                  isIncrease ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isIncrease ? '↑' : '↓'} {change}
              </span>
            )}
          </div>
          {linkText && (
            <button
              onClick={onClick}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              {linkText}
            </button>
          )}
        </div>
        <div className={`rounded-md p-3 ${iconBgColor}`}>{icon}</div>
      </div>
    </div>
  );
};

const UserStatsCard: React.FC<UserStatsProps> = ({
  totalUsers,
  newUsers,
  bannedUsers,
  reportedUsers,
  isLoading = false,
  onViewAll,
}) => {
  // 로딩 상태일 때 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="w-2/3">
                <div className="mb-3 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-8 w-1/2 rounded bg-gray-300"></div>
                <div className="mt-2 h-4 w-1/3 rounded bg-gray-200"></div>
              </div>
              <div className="h-12 w-12 rounded-md bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="전체 회원"
        value={totalUsers.toLocaleString()}
        iconBgColor="bg-blue-100"
        icon={<Users className="h-6 w-6 text-blue-600" />}
        linkText="모든 회원 보기"
        onClick={() => onViewAll && onViewAll('all')}
      />
      <StatsCard
        title="신규 회원 (이번 달)"
        value={newUsers.toLocaleString()}
        change="12%"
        isIncrease={true}
        iconBgColor="bg-green-100"
        icon={<UserPlus className="h-6 w-6 text-green-600" />}
        linkText="신규 회원 보기"
        onClick={() => onViewAll && onViewAll('new')}
      />
      <StatsCard
        title="차단된 회원"
        value={bannedUsers.toLocaleString()}
        change="3%"
        isIncrease={false}
        iconBgColor="bg-red-100"
        icon={<UserX className="h-6 w-6 text-red-600" />}
        linkText="차단 회원 보기"
        onClick={() => onViewAll && onViewAll('banned')}
      />
      <StatsCard
        title="신고된 회원"
        value={reportedUsers.toLocaleString()}
        iconBgColor="bg-yellow-100"
        icon={<AlertTriangle className="h-6 w-6 text-yellow-600" />}
        linkText="신고 내역 보기"
        onClick={() => onViewAll && onViewAll('reported')}
      />
    </div>
  );
};

export default UserStatsCard;
