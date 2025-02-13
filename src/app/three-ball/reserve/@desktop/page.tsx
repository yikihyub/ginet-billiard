import React from 'react';

import { SearchBar } from './_components/search/search-bar';
import { StoreList } from './_components/list/store-list';

import '../../threeBall.css';

export default function DesktopPage() {
  return (
    <>
      <aside className="leftsidebar h-full w-full md:w-[400px]">
        <div className="flex h-full w-full flex-col">
          <SearchBar />
          <div className="px-4">
            <StoreList />
          </div>
        </div>
      </aside>
    </>
  );
}
