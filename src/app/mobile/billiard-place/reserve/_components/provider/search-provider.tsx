'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useStores } from '@/app/mobile/_hooks/reserve/useStores';
import { useLocation } from '../context/location-context';
import { Store } from '@/types/(reserve)';

// 컨텍스트 타입 정의
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredRooms: Store[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

// 초기 상태 정의
const initialSearchContext: SearchContextType = {
  searchQuery: '',
  setSearchQuery: () => {},
  filteredRooms: undefined,
  isLoading: false,
  error: null,
};

// 타입을 지정하여 컨텍스트 생성
const SearchContext = createContext<SearchContextType>(initialSearchContext);

interface SearchProviderProps {
  children: ReactNode;
}

// 검색 Provider 컴포넌트
export function SearchProvider({ children }: SearchProviderProps) {
  const { bounds } = useLocation();
  const { rooms, isLoading, error } = useStores(bounds || undefined);

  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<Store[]>([]);

  // 검색 결과 업데이트
  useEffect(() => {
    if (!rooms) {
      setFilteredRooms([]);
      return;
    }

    // 검색어가 없으면 모든 방을 표시
    if (!searchQuery.trim()) {
      setFilteredRooms(rooms);
      return;
    }

    // 이름으로만 검색 (대소문자 구분 없이)
    const filtered = rooms.filter(
      (room) =>
        room.name && room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredRooms(filtered);
  }, [rooms, searchQuery]);

  // Provider 값
  const value: SearchContextType = {
    searchQuery,
    setSearchQuery,
    filteredRooms,
    isLoading,
    error,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

// 커스텀 훅
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === initialSearchContext) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
