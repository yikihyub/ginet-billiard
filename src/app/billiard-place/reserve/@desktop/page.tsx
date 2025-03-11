import React from 'react';

import { SearchBar } from './_components/search/search-bar';
import { StoreList } from './_components/list/store-list';
import { SearchProvider } from '../_components/provider/search-provider';
import FavoritesList from './_components/list/favorite-list';

import '../../threeBall.css';

export default function DesktopPage() {
  return (
    <>
      <aside className="leftsidebar no-scrollbar h-full w-full md:w-[400px]">
        <div className="flex h-full w-full flex-col">
          <SearchProvider>
            <SearchBar />
            <div className="px-4">
              <StoreList />
            </div>
          </SearchProvider>
        </div>
      </aside>
      {/* 즐겨찾기 섹션 - 지도 위에 고정 */}
      <div className="absolute left-[410px] top-28 z-10 w-[360px]">
        <FavoritesList />
      </div>
    </>
  );
}
