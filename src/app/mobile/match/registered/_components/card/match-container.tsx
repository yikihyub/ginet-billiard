'use client';

import { useMatch } from '../context/match-context';
import { MatchStats } from './info-card';
import { SearchBar } from '../search/search-bar';
import { MatchList } from '../list/match-list';
import { LoadingState } from '../loading/loading-state';

export function MatchContainer() {
  const {
    isLoading,
    activeMatches,
    totalPlayers,
    searchQuery,
    setSearchQuery,
    fetchPlayers,
  } = useMatch();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col bg-gray-50">
      <div className="flex items-center justify-between bg-white px-4">
        <div className="text-lg font-semibold">매치 등록 현황</div>
      </div>
      <div className="bg-white p-4">
        <MatchStats activeMatches={activeMatches} totalPlayers={totalPlayers} />
      </div>

      <div className="bg-white px-4 pb-4">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={fetchPlayers}
        />
      </div>

      <div className="min-h-[80vh] bg-gray-50 p-2">
        <MatchList />
      </div>
    </div>
  );
}
