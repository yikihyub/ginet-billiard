'use client';

import { BilliardRoomCard } from '../card/billiard-roomcard';
import { useSearch } from '../provider/search-provider';

export function StoreList() {
  const { filteredRooms, isLoading, error, searchQuery } = useSearch();

  if (isLoading) {
    return <p className="text-center text-gray-500">당구장을 검색하는 중...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        데이터를 불러오는데 실패했습니다.
      </p>
    );
  }

  if (!filteredRooms || filteredRooms.length === 0) {
    // 검색어가 있는 경우 맞춤형 메시지 표시
    if (searchQuery) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            다른 검색어를 사용해보세요.
          </p>
        </div>
      );
    }

    // 검색어가 없는 경우 기본 메시지 표시
    return (
      <p className="text-center text-gray-500">등록된 당구장이 없습니다.</p>
    );
  }

  return (
    <div>
      {searchQuery && (
        <p className="mb-4 text-sm text-gray-500">
          &quot;{searchQuery}&quot; 검색 결과: {filteredRooms.length}개
        </p>
      )}
      {filteredRooms.map((room) => (
        <div key={room.id}>
          <div className="border border-[#eee]"></div>
          <BilliardRoomCard room={room} />
        </div>
      ))}
    </div>
  );
}
