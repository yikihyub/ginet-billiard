'use client';

import { useStores } from '@/hooks/reserve/useStores';
import { BilliardRoomCard } from '../card/billiard-roomcard';

export function StoreList({ onCloseDrawer }: { onCloseDrawer: () => void }) {
  const { rooms, isLoading, error } = useStores();

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

  if (!rooms || rooms.length === 0) {
    return (
      <p className="text-center text-gray-500">등록된 당구장이 없습니다.</p>
    );
  }

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id}>
          <div className="border border-[#eee]"></div>
          <BilliardRoomCard room={room} onCloseDrawer={onCloseDrawer} />
        </div>
      ))}
    </div>
  );
}
