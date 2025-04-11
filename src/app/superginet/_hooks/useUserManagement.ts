'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Filters, ApiResponse, UserStats } from '../_types/user';

export const useUserManagement = () => {
  // 상태 관리
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof User>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Filters>({
    level: 'all',
    status: 'all',
    game: 'all',
    warningCount: 'all',
  });

  // 상세 보기 상태
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // 사용자 목록 조회 함수
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // API 쿼리 파라미터 구성
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
        sortField: sortField as string,
        sortDirection,
      });
      
      // 검색어가 있으면 추가
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // 필터 추가
      if (filters.level !== 'all') {
        params.append('level', filters.level);
      }
      
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      if (filters.game !== 'all') {
        params.append('game', filters.game);
      }
      
      if (filters.warningCount !== 'all') {
        params.append('warningCount', filters.warningCount);
      }
      
      // 첫 페이지에서만 통계 정보 요청
      if (currentPage === 1) {
        params.append('stats', 'true');
      }
      
      // API 호출
      const response = await fetch(`/api/users?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '사용자 목록을 불러오는데 실패했습니다');
      }
      
      const data: ApiResponse = await response.json();
      
      // 데이터 설정
      setUsers(data.users);
      setTotalUsers(data.pagination.total);
      setTotalPages(data.pagination.pages);
      
      // 통계 정보가 있으면 설정
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('사용자 목록 조회 실패:', err);
      setError(err instanceof Error ? err.message : '사용자 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, usersPerPage, sortField, sortDirection, searchTerm, filters]);

  // 사용자 상세 정보 조회
  const fetchUserDetail = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '사용자 정보를 불러오는데 실패했습니다');
      }
      
      const userData = await response.json();
      return userData;
    } catch (err) {
      console.error('사용자 상세 정보 조회 실패:', err);
      setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 차단 처리
  const handleBanUser = async (userId: number, reason: string, duration: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason, duration }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '사용자 차단에 실패했습니다');
      }
      
      const updatedUser = await response.json();
      
      // 사용자 목록 갱신
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
      
      // 모달 닫기
      setShowBanModal(false);
      setUserToBan(null);
      
      return updatedUser;
    } catch (err) {
      console.error('사용자 차단 실패:', err);
      setError(err instanceof Error ? err.message : '사용자 차단에 실패했습니다');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 차단 해제 처리
  const handleUnbanUser = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}/unban`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '사용자 차단 해제에 실패했습니다');
      }
      
      const updatedUser = await response.json();
      
      // 사용자 목록 갱신
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
      
      return updatedUser;
    } catch (err) {
      console.error('사용자 차단 해제 실패:', err);
      setError(err instanceof Error ? err.message : '사용자 차단 해제에 실패했습니다');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 차단 모달 확인 핸들러
  const confirmBanUser = async (userId: number, reason: string, duration: number) => {
    const result = await handleBanUser(userId, reason, duration);
    if (result) {
      alert(`사용자 ${userId}가 차단되었습니다.`);
    }
  };

  // 사용자 상세 정보 조회 및 모달 열기
  const viewUserDetail = async (userId: number) => {
    const userData = await fetchUserDetail(userId);
    if (userData) {
      setSelectedUser(userData);
    }
  };

  // 필터 변경 시 데이터 다시 로드
  useEffect(() => {
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
  }, [searchTerm, filters, sortField, sortDirection]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    filteredUsers: users,
    isLoading,
    error,
    currentPage,
    usersPerPage,
    totalPages,
    totalUsers,
    stats,
    searchTerm,
    filters,
    sortField,
    sortDirection,
    selectedUser,
    showBanModal,
    userToBan,
    setSearchTerm,
    setFilters,
    setSortField,
    setSortDirection,
    setCurrentPage,
    setSelectedUser,
    setShowBanModal,
    setUserToBan,
    handleBanUser,
    handleUnbanUser,
    confirmBanUser,
    viewUserDetail,
    fetchUsers
  };
};