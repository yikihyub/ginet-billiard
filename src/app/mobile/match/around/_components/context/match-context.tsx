'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { User, UserContextType } from '../../../_types';

// 기본값으로 초기화된 컨텍스트 생성
const UserContext = createContext<UserContextType>({
  users: [],
  loading: true,
  error: null,
  maxDistance: 50,
  setMaxDistance: () => {},
  refreshUsers: async () => {},
  gameType: '전체',
  setGameType: () => {},
});

// 컨텍스트 훅 생성
export const useUserContext = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(50);
  const [gameType, setGameType] = useState('전체');

  const { data: session } = useSession();
  const userId = session?.user.mb_id;

  const fetchNearbyUsers = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/member/getmember?maxDistance=${maxDistance}&userId=${userId}&gameType=${encodeURIComponent(gameType)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyUsers();
  }, [maxDistance, userId, gameType]);

  // 컨텍스트 값 정의
  const contextValue: UserContextType = {
    users,
    loading,
    error,
    maxDistance,
    setMaxDistance,
    refreshUsers: fetchNearbyUsers,
    gameType,
    setGameType,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
