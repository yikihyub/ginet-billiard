'use client';

import { useMatch } from '../context/match-context';
import { MatchCard } from '../card/match-card';
import { EmptyMatchList } from './empty-list';
import { RegisteredPlayer } from '../../../_types';

export function MatchList() {
  const {
    players,
    processingMatchId,
    userId,
    handleMatchRequest,
    searchQuery,
  } = useMatch();

  // 검색어를 기반으로 필터링
  const filteredPlayers = players.filter((player) => {
    if (!searchQuery) return true;

    // 검색어가 있는 경우 이름, 장소, 게임 유형 등으로 검색
    const searchLower = searchQuery.toLowerCase();
    return (
      player.bi_user?.name?.toLowerCase().includes(searchLower) ||
      player.billiard_place?.toLowerCase().includes(searchLower) ||
      player.game_type?.toLowerCase().includes(searchLower)
    );
  });

  if (filteredPlayers.length === 0) {
    return <EmptyMatchList />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {filteredPlayers.map((player: RegisteredPlayer) => (
        <MatchCard
          key={player.id}
          player={player}
          userId={userId}
          isProcessing={processingMatchId === player.bi_user.mb_id}
          onMatchRequest={handleMatchRequest}
        />
      ))}
    </div>
  );
}
